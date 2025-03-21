const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    userType: { type: String, enum: ['admin'], required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Admin-specific functionalities
    managedHackathons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon' }], // Hackathons managed by the admin
    managedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }], // Companies verified/managed by admin
    managedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Students overseen by admin

    role: { type: String, enum: ['SuperAdmin', 'Moderator'], default: 'Moderator' }, // Role-based access control
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
