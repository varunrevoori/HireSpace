const mongoose = require('mongoose');

const HackathonSchema = new mongoose.Schema({
    hackathonId: { type: String, unique: true, required: true }, // Unique Hackathon ID
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

// ✅ Middleware to auto-generate a unique hackathonId
HackathonSchema.pre('save', async function (next) {
    if (!this.hackathonId) {
        let uniqueId;
        let isUnique = false;

        // Generate a unique sequential ID
        while (!isUnique) {
            uniqueId = `HACK-${Math.floor(100000 + Math.random() * 900000)}`; // Generates HACK-XXXXXX
            const existingHackathon = await this.constructor.findOne({ hackathonId: uniqueId });
            if (!existingHackathon) isUnique = true;
        }

        this.hackathonId = uniqueId;
    }

    // Update total participants count before saving
    this.totalParticipants = this.participants.length;
    next();
});

module.exports = mongoose.model('Hackathon', HackathonSchema);
