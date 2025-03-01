const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Student applying
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Job applied for
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, // Status tracking
    appliedAt: { type: Date, default: Date.now } // Timestamp of application
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
