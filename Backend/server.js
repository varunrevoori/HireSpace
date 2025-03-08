require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Database connected successfully"))
.catch(err => console.error("❌ Database connection error:", err));

// Import Routes
const studentApp = require('./apis/student');
const companyApp = require('./apis/company');
const adminApp = require('./apis/admin'); 
const jobAppRouter = require('./apis/job');
const hackthonapp=require('./apis/hackthon');

// Use Routes
app.use('/apis/students', studentApp);
app.use('/apis/companies', companyApp);
app.use('/apis/admin', adminApp); 
app.use('/apis/jobs', jobAppRouter);
app.use('/apis/hackathons',hackthonapp);

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Correct syntax:
app.listen(5001, () => {
    console.log('Server running on port 5001');
  });
