const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const JobApplication = require("../models/jobstatusmodel");
const Job = require("../models/jobmodel");
// const { v4: uuidv4 } = require('uuid');
const Student = require("../models/studentmodel");
const jobAppRouter = express.Router();

//api end point to get the job postings from database
jobAppRouter.get(
  "/joblisting",
  expressAsyncHandler(async (req, res) => {
    try {
      const jobslist = await Job.find().sort({ jobId: 1 }); // Fetch all jobs from MongoDB
      res.json(jobslist); // Send response as JSON
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch jobs", error: error.message });
    }
  })
);

// Create a new job
jobAppRouter.post(
  "/create",
  expressAsyncHandler(async (req, res) => {
    console.log("📩 Job creation request received:", req.body);

    const {
      jobId,
      title,
      category,
      companyName,
      companyId,
      location,
      description,
      skillsRequired,
      jobType,
      experience,
      salaryRange,
    } = req.body;

    // Validate required fields
    if (
      !jobId ||
      !companyId ||
      !companyName ||
      !title ||
      !location ||
      !description ||
      !skillsRequired ||
      !jobType ||
      !experience ||
      !salaryRange
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    try {
      // Check if a job with the same jobId already exists
      const existingJob = await Job.findOne({ jobId });

      if (existingJob) {
        return res.status(400).json({
          message: "❌ Job ID already exists. Please use a unique jobId.",
        });
      }

      // Create a new job entry
      const newJob = new Job({
        jobId,
        title,
        category,
        companyName,
        companyId,
        location,
        description,
        skillsRequired,
        jobType,
        experience,
        salaryRange,
      });

      // Save job to database
      await newJob.save();

      console.log("✅ Job created successfully:", newJob);

      res
        .status(201)
        .json({ message: "Job created successfully", job: newJob });
    } catch (error) {
      console.error("❌ Error creating job:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  })
);

jobAppRouter.post(
  "/apply",
  expressAsyncHandler(async (req, res) => {
    console.log("📩 Job application request received:", req.body);

    const { jobId, username, resumeUrl } = req.body;

    // ✅ Validate input
    if (!jobId || !username || !resumeUrl) {
      return res
        .status(400)
        .json({ message: "jobId, username, and resume URL are required." });
    }

    try {
      // ✅ Check if job exists
      const jobExists = await Job.findOne({ jobId });
      if (!jobExists) {
        return res.status(404).json({ message: "Job not found." });
      }

      // ✅ Check if user already applied
      const existingApplication = await JobApplication.findOne({
        jobId,
        username,
      });
      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "You have already applied for this job." });
      }

      // ✅ Store resume URL in MongoDB
      const newApplication = new JobApplication({
        jobId,
        username,
        resumeUrl, // Store the URL
      });

      await newApplication.save();

      console.log("✅ Job application submitted:", newApplication);
      res.status(201).json({
        message: "Job application submitted successfully!",
        newApplication,
      });
    } catch (error) {
      console.error("❌ Error applying for job:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  })
);

// Get all job applications for a student
jobAppRouter.get(
  "/student/:username",
  expressAsyncHandler(async (req, res) => {
    const { username } = req.params;

    const applications = await JobApplication.find({ username }).populate(
      "job"
    );
    res.json(applications);
  })
);

// Get all job applications for a specific job
jobAppRouter.get(
  "/job/:jobId",
  expressAsyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const applications = await JobApplication.find({ job: jobId }).populate(
      "username"
    );
    res.json(applications);
  })
);

// Update job application status
jobAppRouter.patch(
  "/update-status",
  expressAsyncHandler(async (req, res) => {
    const { applicationId, status } = req.body;

    if (
      !applicationId ||
      !["Pending", "Accepted", "Rejected"].includes(status)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid application ID or status" });
    }

    await JobApplication.findByIdAndUpdate(applicationId, { status });
    res.json({ message: "Job application status updated successfully" });
  })
);

//const fs = require("fs").promises; // Use async file reading

// // Route to insert jobs only once
// jobAppRouter.post("/import-jobs", expressAsyncHandler(async (req, res) => {
//     try {
//         // ✅ Check if at least one job already exists (faster than fetching all jobs)
//         const existingJob = await Job.exists({});
//         if (existingJob) {
//             return res.status(400).json({ message: "Jobs already imported!" });
//         }

//         // ✅ Read the file asynchronously
//         const jobsData = JSON.parse(await fs.readFile("jobs (2).json", "utf-8"));

//         // ✅ Insert data into MongoDB
//         await Job.insertMany(jobsData);

//         res.status(201).json({ message: "Jobs successfully imported! 🎉" });
//     } catch (error) {
//         console.error("❌ Error importing jobs:", error);
//         res.status(500).json({ message: "Failed to import jobs", error });
//     }
// }));

module.exports = jobAppRouter;
