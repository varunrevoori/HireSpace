const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Job = require("../../models/jobs/jobmodel");
const verifyToken = require('../../middlewares/verifytoken');
const Student = require("../../models/student/studentmodel");
const jobAppRouter = express.Router();

// ✅ Get all job postings
jobAppRouter.get(
  "/joblisting",
  expressAsyncHandler(async (req, res) => {
    try {
      const jobslist = await Job.find().sort({ jobId: 1 }); // Fetch jobs sorted by jobId
      res.json(jobslist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
    }
  })
);

jobAppRouter.get(
    "/job/:jobId",
    expressAsyncHandler(async (req, res) => {
      try {
        const { jobId } = req.params;
        const job = await Job.findOne({ jobId });
  
        if (!job) {
          return res.status(404).json({ message: "❌ Job not found" });
        }
  
        res.status(200).json(job);
      } catch (error) {
        console.error("❌ Error fetching job details:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    })
  );
// ✅ Create a new job (Protected)
jobAppRouter.post('/create', verifyToken, expressAsyncHandler(async (req, res) => {
    console.log("📩 Job creation request received:", req.body);

    const {
      jobId, title, category, companyName, companyId,
      location, description, skillsRequired, jobType,
      experience, salaryRange
    } = req.body;

    if (!jobId || !companyId || !companyName || !title || !location || !description || !skillsRequired || !jobType || !experience || !salaryRange) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    try {
        const existingJob = await Job.findOne({ jobId });

        if (existingJob) {
            return res.status(400).json({ message: "❌ Job ID already exists. Please use a unique jobId." });
        }

        const newJob = new Job({
            jobId, title, category, companyName, companyId,
            location, description, skillsRequired, jobType,
            experience, salaryRange
        });

        await newJob.save();
        console.log("✅ Job created successfully:", newJob);

        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        console.error("❌ Error creating job:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));
jobAppRouter.post('/mock-interview/start', async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    const question = await generateQuestion(job);
    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit answer and get feedback + follow-up question
jobAppRouter.post('/mock-interview/answer', async (req, res) => {
  const { question, answer } = req.body;
  try {
    const feedback = await generateFeedback(question, answer);
    const followUp = await generateFollowUp();
    res.json({ feedback, followUp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = jobAppRouter;
