const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const Application = require("../../models/jobs/Applicationmodel")
const Job = require("../../models/jobs/jobmodel")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/resumes"

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, "resume-" + uniqueSuffix + ext)
  },
})

// File filter to only allow PDF and Word documents
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only PDF and Word documents are allowed."), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
})

// Submit job application
router.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const { jobId, fullName, email, phone, experience, coverLetter } = req.body

    // Validate required fields
    if (!jobId || !fullName || !email || !phone || !experience) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Check if job exists
    const job = await Job.findOne({ jobId })
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    // Check if resume was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" })
    }

    // Create new application
    const newApplication = new Application({
      jobId,
      fullName,
      email,
      phone,
      experience,
      coverLetter: coverLetter || "",
      resumeUrl: req.file.path,
    })

    await newApplication.save()

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: newApplication._id,
    })
  } catch (error) {
    console.error("Error submitting application:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get applications for a specific job (for admin/employer)
router.get("/job/:jobId", async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
    res.status(200).json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get applications for a specific user by email
router.get("/user/:email", async (req, res) => {
  try {
    const applications = await Application.find({ email: req.params.email })

    // Get job details for each application
    const applicationsWithJobDetails = await Promise.all(
      applications.map(async (application) => {
        const job = await Job.findOne({ jobId: application.jobId })
        return {
          ...application.toObject(),
          jobTitle: job?.title || "Unknown Job",
          company: job?.company || "Unknown Company",
        }
      }),
    )

    res.status(200).json(applicationsWithJobDetails)
  } catch (error) {
    console.error("Error fetching user applications:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update application status (for admin/employer)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!["Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    res.status(200).json(application)
  } catch (error) {
    console.error("Error updating application status:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router

