const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId: { type: String, required: true }, // ✅ Change to String instead of ObjectId
    title: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Company should be ObjectId
    location: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    jobType: { type: String, required: true },
    experience: { type: String, required: true },
    salaryRange: { type: String, required: true }
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
