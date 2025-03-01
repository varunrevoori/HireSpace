require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Use Routes
app.use('/apis/students', studentApp);
app.use('/apis/companies', companyApp);
app.use('/apis/admin', adminApp); 
app.use('/apis/jobs', jobAppRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
