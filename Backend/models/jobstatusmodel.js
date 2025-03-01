const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        trim: true, 
        index: true 
    }, // Reference the student by unique username
    
    jobId: { 
        type: String, 
        required: true 
    }, // Keep jobId as a string
    
    resumeUrl: { 
        type: String, 
        required: true, 
        trim: true 
    }, // Store file path instead of URL

    status: { 
        type: String, 
        enum: ['Pending', 'Accepted', 'Rejected'], 
        default: 'Pending' 
    },

    appliedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
