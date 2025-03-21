const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    ref: "Job",
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewing", "Shortlisted", "Rejected", "Hired"],
    default: "Pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
})

const Application = mongoose.model("Application", applicationSchema)

module.exports = Application

