const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const JobApplication = require('../models/JobApplication');
const Student = require('../models/Student');
const Job = require('../models/Job');

const jobAppRouter = express.Router();

// Apply for a Job
jobAppRouter.post('/apply', expressAsyncHandler(async (req, res) => {
    const { studentId, jobId } = req.body;

    if (!studentId || !jobId) {
        return res.status(400).json({ message: 'Student ID and Job ID are required' });
    }

    const existingApplication = await JobApplication.findOne({ student: studentId, job: jobId });
    if (existingApplication) {
        return res.status(400).json({ message: 'Job already applied for' });
    }

    const newApplication = new JobApplication({ student: studentId, job: jobId });
    await newApplication.save();

    // Add application reference to Student Schema
    await Student.findByIdAndUpdate(studentId, { $push: { appliedJobs: newApplication._id } });

    res.status(201).json({ message: 'Job application submitted successfully' });
}));

// Get all job applications for a student
jobAppRouter.get('/student/:studentId', expressAsyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const applications = await JobApplication.find({ student: studentId }).populate('job');
    res.json(applications);
}));

// Get all job applications for a specific job
jobAppRouter.get('/job/:jobId', expressAsyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const applications = await JobApplication.find({ job: jobId }).populate('student');
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
