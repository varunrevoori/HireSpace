const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
})
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Database connection error:", err));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import Routes
const studentApp = require('./apis/student/student');
const companyApp = require('./apis/company/company');
const adminApp = require('./apis/admin/admin');
const jobAppRouter = require('./apis/job/job');
const hackthonapp = require('./apis/hackthon/hackthon');
const router = require('./apis/hackthon/githubAuth');
const applicationRoutes = require('./apis/job/ApplicationRoute');
const mocktest = require('./apis/mocktests/mocktests'); // Import mocktest router

// Use Routes
app.use('/apis/student', studentApp);
app.use('/apis/company', companyApp);
app.use('/apis/admin', adminApp);
app.use('/apis/job', jobAppRouter);
app.use('/apis/hackathon', hackthonapp);
app.use('/apis/auth', router);
app.use('/apis/applications', applicationRoutes);
app.use('/apis/mocktests', mocktest); // Mount at /apis/mocktests

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start the server
app.listen(5001, () => {
  console.log('Server running on port 5001');
});