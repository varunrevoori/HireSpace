const mongoose = require('mongoose');

const HackathonProfileSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    
    participatedHackathons: [{ 
        hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' },
        gitRepository: { type: String }, // GitHub repo link
        gitScore: { type: Number, default: 0 }, // Git-based scoring
        domainScore: { type: Number, default: 0 }, // Domain-specific score
        submissionDate: { type: Date, default: Date.now } // Date of participation
    }], 
    
    domainScores: { type: Map, of: Number, default: {} }, // Tracks cumulative domain-wise scores
    
    gitScore: { type: Number, default: 0 }, // Overall Git score
    totalHackathonsParticipated: { type: Number, default: 0 }, // Number of hackathons participated
    totalHackathonScore: { type: Number, default: 0 }, // Total calculated score
    ranking: { type: Number, default: 0 }, // Global ranking (can be updated dynamically)
    badges: [{ type: String }], // Achievements like "Top Performer", "Best Code Quality"
    
    finalScore: { type: Number, default: 0 } // Final computed score
}, { timestamps: true });

// Middleware to calculate final score dynamically
HackathonProfileSchema.pre('save', function (next) {
    this.totalHackathonScore = Array.from(this.domainScores.values()).reduce((a, b) => a + b, 0);
    this.finalScore = this.gitScore + this.totalHackathonScore;
    this.totalHackathonsParticipated = this.participatedHackathons.length;
    next();
});

module.exports = mongoose.model('HackathonProfile', HackathonProfileSchema);
