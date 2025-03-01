const mongoose = require('mongoose');

const HackathonProfileSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        index: true // Improves query performance
    },

    participatedHackathons: [{ 
        hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
        gitRepository: { type: String, trim: true }, // Trim spaces for consistency
        gitScore: { type: Number, default: 0, min: 0 }, // Prevents negative scores
        domainScore: { type: Number, default: 0, min: 0 }, // Prevents negative scores
        submissionDate: { type: Date, default: Date.now } 
    }], 
    
    domainScores: { type: Map, of: Number, default: {} }, // Tracks cumulative domain-wise scores
    
    gitScore: { type: Number, default: 0, min: 0 }, // Overall Git score
    totalHackathonsParticipated: { type: Number, default: 0, min: 0 }, // Auto-updates
    totalHackathonScore: { type: Number, default: 0, min: 0 }, // Auto-updates
    ranking: { type: Number, default: 0, min: 0 }, // Global ranking
    
    badges: [{ type: String, trim: true }], // Trim spaces in badge names
    
    finalScore: { type: Number, default: 0, min: 0 } // Final computed score
}, { timestamps: true });

// Middleware to calculate final score dynamically
HackathonProfileSchema.pre('save', function (next) {
    this.totalHackathonScore = Array.from(this.domainScores.values()).reduce((a, b) => a + b, 0);
    this.finalScore = this.gitScore + this.totalHackathonScore;
    this.totalHackathonsParticipated = this.participatedHackathons.length;
    next();
});

module.exports = mongoose.model('HackathonProfile', HackathonProfileSchema);
