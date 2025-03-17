const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const JobApplication = require('../models/jobstatusmodel');
const Job = require('../models/jobmodel');
const Student = require('../models/studentmodel');
const verifyToken = require('../middlewares/verifytoken'); // Import token verification middleware

const jobAppRouter = express.Router();

// ✅ Create a new job (Protected)
jobAppRouter.post('/create', verifyToken, expressAsyncHandler(async (req, res) => {
    console.log("📩 Job creation request received:", req.body);

    const { jobId, title, companyName, companyId, location, description, skillsRequired, jobType, experience, salaryRange } = req.body;

    if (!jobId || !companyId || !companyName || !title || !location || !description || !skillsRequired || !jobType || !experience || !salaryRange) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    try {
        const existingJob = await Job.findOne({ jobId });

        if (existingJob) {
            return res.status(400).json({ message: "❌ Job ID already exists. Please use a unique jobId." });
        }

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

        await newJob.save();
        console.log("✅ Job created successfully:", newJob);

        res.status(201).json({ message: 'Job created successfully', job: newJob });

    } catch (error) {
        console.error("❌ Error creating job:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));

// ✅ Apply for a job (Protected)
jobAppRouter.post('/apply', verifyToken, expressAsyncHandler(async (req, res) => {
    console.log("📩 Job application request received:", req.body);
    
    const { jobId, username, resumeUrl } = req.body;

    if (!jobId || !username || !resumeUrl) {
        return res.status(400).json({ message: "jobId, username, and resume URL are required." });
    }

    try {
        const jobExists = await Job.findOne({ jobId });
        if (!jobExists) {
            return res.status(404).json({ message: "Job not found." });
        }

        const existingApplication = await JobApplication.findOne({ jobId, username });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        const newApplication = new JobApplication({
            jobId,
            username,
            resumeUrl
        });

        await newApplication.save();
        console.log("✅ Job application submitted:", newApplication);
        res.status(201).json({ message: "Job application submitted successfully!", newApplication });

    } catch (error) {
        console.error("❌ Error applying for job:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}));

// ✅ Get all job applications for a student (Protected)
jobAppRouter.get('/student/:username', verifyToken, expressAsyncHandler(async (req, res) => {
    const { username } = req.params;
    
    if (req.user.username !== username) {
        return res.status(403).json({ message: "Unauthorized access to applications." });
    }

    const applications = await JobApplication.find({ username }).populate('job');
    res.json(applications);
}));

// ✅ Get all job applications for a specific job (Protected)
jobAppRouter.get('/job/:jobId', verifyToken, expressAsyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const applications = await JobApplication.find({ job: jobId }).populate('username');
    res.json(applications);
}));

// ✅ Update job application status (Protected)
jobAppRouter.patch('/update-status', verifyToken, expressAsyncHandler(async (req, res) => {
    const { applicationId, status } = req.body;

    if (!applicationId || !['Pending', 'Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid application ID or status' });
    }

    await JobApplication.findByIdAndUpdate(applicationId, { status });
    res.json({ message: 'Job application status updated successfully' });
}));

module.exports = jobAppRouter;
