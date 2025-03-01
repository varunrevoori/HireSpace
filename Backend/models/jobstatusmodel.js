const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        trim: true, 
        index: true // Improves query performance
    }, // Reference the student by unique username

    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    }, // Job applied for

    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected'], 
        default: 'Pending' 
    }, // Status tracking

    appliedAt: { 
        type: Date, 
        default: Date.now 
    } // Timestamp of application
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
