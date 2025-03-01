const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const JobApplication = require('../models/jobstatusmodel');
const Job = require('../models/jobmodel');
// const { v4: uuidv4 } = require('uuid');
const Student = require('../models/studentmodel');
const jobAppRouter = express.Router();
// Create a new job
jobAppRouter.post('/create', expressAsyncHandler(async (req, res) => {
    console.log("📩 Job creation request received:", req.body);

    const { jobId, title, companyName, companyId, location, description, skillsRequired, jobType, experience, salaryRange } = req.body;

    // Validate required fields
    if (!jobId || !companyId || !companyName || !title || !location || !description || !skillsRequired || !jobType || !experience || !salaryRange) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    try {
        // Check if a job with the same jobId already exists
        const existingJob = await Job.findOne({ jobId });

        if (existingJob) {
            return res.status(400).json({ message: "❌ Job ID already exists. Please use a unique jobId." });
        }

        // Create a new job entry
        const newJob = new Job({
            jobId,
            title,
            companyName,
            companyId,
            location,
            description,
            skillsRequired,
            jobType,
            experience,
            salaryRange
        });

        // Save job to database
        await newJob.save();

        console.log("✅ Job created successfully:", newJob);

        res.status(201).json({ message: 'Job created successfully', job: newJob });

    } catch (error) {
        console.error("❌ Error creating job:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));


jobAppRouter.post('/apply', expressAsyncHandler(async (req, res) => {
    console.log("📩 Job application request received:", req.body);
    
    const { jobId, username, resumeUrl } = req.body;

    // ✅ Validate input
    if (!jobId || !username || !resumeUrl) {
        return res.status(400).json({ message: "jobId, username, and resume URL are required." });
    }

    try {
        // ✅ Check if job exists
        const jobExists = await Job.findOne({ jobId });
        if (!jobExists) {
            return res.status(404).json({ message: "Job not found." });
        }

        // ✅ Check if user already applied
        const existingApplication = await JobApplication.findOne({ jobId, username });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        // ✅ Store resume URL in MongoDB
        const newApplication = new JobApplication({
            jobId,
            username,
            resumeUrl // Store the URL
        });

        await newApplication.save();

        console.log("✅ Job application submitted:", newApplication);
        res.status(201).json({ message: "Job application submitted successfully!", newApplication });

    } catch (error) {
        console.error("❌ Error applying for job:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));




// Get all job applications for a student
jobAppRouter.get('/student/:username', expressAsyncHandler(async (req, res) => {
    const { username } = req.params;

    const applications = await JobApplication.find({ username }).populate('job');
    res.json(applications);
}));

// Get all job applications for a specific job
jobAppRouter.get('/job/:jobId', expressAsyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const applications = await JobApplication.find({ job: jobId }).populate('username');
    res.json(applications);
}));

// Update job application status
jobAppRouter.patch('/update-status', expressAsyncHandler(async (req, res) => {
    const { applicationId, status } = req.body;

    if (!applicationId || !['Pending', 'Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid application ID or status' });
    }

    await JobApplication.findByIdAndUpdate(applicationId, { status });
    res.json({ message: 'Job application status updated successfully' });
}));

module.exports = jobAppRouter;
