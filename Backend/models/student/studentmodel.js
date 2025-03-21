const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    userType: { type: String, enum: ['student'], required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    skills: { type: [String], default: [] },
    education: { type: [String], default: [] }, 
    projects: { type: [String], default: [] },

    atsScore: { type: Number, default: 0 }, // ATS resume score
    hackathonProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'HackathonProfile' }, // Reference to Hackathon Profile
    
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }], // Job applications

    totalHackathonScore: { type: Number, default: 0 }, // Sum of all hackathon scores
    finalScore: { type: Number, default: 0 } // Final computed score based on ATS, Hackathons, etc.
}, { timestamps: true });

// Middleware to update final score dynamically
StudentSchema.pre('save', function (next) {
    this.finalScore = this.atsScore + this.totalHackathonScore;
    next();
});

module.exports = mongoose.model('Student', StudentSchema);
