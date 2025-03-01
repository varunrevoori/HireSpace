const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const JobApplication = require('../models/jobstatusmodel');
const Student = require('../models/studentmodel');
const Job = require('../models/jobmodel');

const jobAppRouter = express.Router();

// Apply for a Job
jobAppRouter.post('/apply', expressAsyncHandler(async (req, res) => {
    const { username, jobId } = req.body;

    if (!username || !jobId) {
        return res.status(400).json({ message: 'Username and Job ID are required' });
    }

    // Check if student exists
    const student = await Student.findOne({ username });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the job application already exists
    const existingApplication = await JobApplication.findOne({ username, job: jobId });
    if (existingApplication) {
        return res.status(400).json({ message: 'Job already applied for' });
    }

    // Create new application
    const newApplication = new JobApplication({ username, job: jobId });
    await newApplication.save();

    // Add application reference to Student Schema
    await Student.findOneAndUpdate({ username }, { $push: { appliedJobs: newApplication._id } });

    res.status(201).json({ message: 'Job application submitted successfully' });
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
