const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Hackathon Title
    problemStatement: { type: String, required: true }, // Problem Description
    domain: { 
        type: String, 
        required: true, 
        enum: ['Cloud', 'Web Development', 'Data Science', 'AI', 'Cybersecurity', 'Blockchain'] 
    }, // Domain of Hackathon
    
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // Organized by a company
    
    participants: [{ 
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        gitRepository: { type: String }, // GitHub Repo Link
        gitScore: { type: Number, default: 0 }, // Git-based scoring
        domainScore: { type: Number, default: 0 }, // Domain-wise score
        submissionDate: { type: Date, default: Date.now } // Date of Submission
    }], 
    
    totalParticipants: { type: Number, default: 0 }, // Total students participating
    topPerformers: [{ 
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
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
