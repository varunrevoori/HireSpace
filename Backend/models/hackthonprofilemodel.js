const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema({
    hackathonId: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Explicit ID
    title: { type: String, required: true }, // Hackathon Title
    problemStatement: { type: String, required: true }, // Problem Description
    domain: { 
        type: String, 
        required: true, 
        enum: ['Cloud', 'Web Development', 'Data Science', 'AI', 'Cybersecurity', 'Blockchain'] 
    }, // Domain of Hackathon
    
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Organized by a company
    
    participants: [{ 
        username: { type: String, required: true, trim: true }, // Student Username
        gitRepository: { type: String, trim: true }, // GitHub Repo Link
        gitScore: { type: Number, default: 0, min: 0 }, // Git-based scoring
        domainScore: { type: Number, default: 0, min: 0 }, // Domain-wise score
        submissionDate: { type: Date, default: Date.now } // Date of Submission
    }], 
    
    totalParticipants: { type: Number, default: 0 }, // Total students participating
    topPerformers: [{ 
        username: { type: String, required: true }, // Top Performer Username
        justification: { type: String } // Why they were selected
    }],

    deadline: { type: Date, required: true }, // Hackathon deadline
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' } // Hackathon status
}, { timestamps: true });

// Middleware to update participant count
HackathonSchema.pre('save', function (next) {
    this.totalParticipants = this.participants.length;
    next();
});

module.exports = mongoose.model('Hackathon', HackathonSchema);
