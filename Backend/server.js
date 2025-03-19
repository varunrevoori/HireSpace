const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const path = require("path"); 


require('dotenv').config();
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
const router = require('./apis/githubAuth');
const applicationRoutes = require('./apis/ApplicationRoute');

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Use Routes
app.use('/apis/student', studentApp);
app.use('/apis/company', companyApp);
app.use('/apis/admin', adminApp); 
app.use('/apis/job', jobAppRouter);
app.use('/apis/hackathon', hackthonapp);
app.use("/apis/applications", applicationRoutes)
app.use('/apis/auth',router);

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Correct syntax:
app.listen(5001, () => {
    console.log('Server running on port 5001');
  });
