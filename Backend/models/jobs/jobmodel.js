const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String, required: true }, // Change to ObjectId if referencing another collection
    companyLogo: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: { type: [String], required: true }, // Array of strings
    jobType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract","Remote"], required: true },
    experience: { type: String, required: true },
    salaryRange: { type: [Number], required: true } // Array with min & max salary
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
