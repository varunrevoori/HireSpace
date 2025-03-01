const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique jobId

const JobSchema = new mongoose.Schema({
    jobId: { type: String, default: uuidv4, unique: true }, // Unique Job ID
    title: { type: String, required: true }, // Job title (e.g., "Software Engineer")
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to company posting the job
    location: { type: String, required: true }, // Location (e.g., "Remote", "New York")
    description: { type: String, required: true }, // Job description
    skillsRequired: { type: [String], default: [] }, // Required skills (e.g., ["React", "Node.js"])
    experience: { type: String, required: true }, // Experience level (e.g., "2+ years")
    salaryRange: { type: String }, // Salary range (e.g., "$60k - $80k")
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobApplication' }], // List of applications
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Job', JobSchema);
