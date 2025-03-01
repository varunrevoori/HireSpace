const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const Company = require('../models/companymodel');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const Job = require('../models/jobmodel');

const companyApp = express.Router();

// Company Registration
companyApp.post('/register', expressAsyncHandler(async (req, res) => {
    const { userType, email, password, companyName, location, description, website } = req.body;

    if (!userType || !email || !password || !companyName) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Check if email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
        return res.status(400).json({ message: 'Email is already taken' });
    }

    // Generate a unique companyId
    const companyId = `COMP-${Date.now()}`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = new Company({
        userType,
        companyId, // Adding companyId
        email,
        password: hashedPassword,
        companyName,
        location,
        description,
        website
    });

    await newCompany.save();
    res.status(201).json({ message: 'Company registered successfully', companyId });
}));

// Company Login
companyApp.post('/login', expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const dbCompany = await Company.findOne({ email });
    if (!dbCompany) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, dbCompany.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Incorrect password' });
    }

    if (!process.env.SECRET_KEY) {
        return res.status(500).json({ message: 'Server error: SECRET_KEY not defined' });
    }

    const token = jwt.sign(
        { companyId: dbCompany.companyId, email: dbCompany.email, userType: dbCompany.userType },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    );

    res.json({ 
        message: 'Login successful', 
        token, 
        company: { 
            companyId: dbCompany.companyId, // Returning companyId in response
            email: dbCompany.email
        } 
    });
}));
// companyApp.post('/create', expressAsyncHandler(async (req, res) => {
//     console.log("📩 Job creation request received:", req.body);

//     const { title,companyName,companyId, location, description, skillsRequired, jobType, experience, salaryRange } = req.body;
//     console.log(req.body);

//     // Validate required fields
//     if (!companyId || !companyName || !title || !location || !description || !skillsRequired || !jobType || !experience || !salaryRange) {
//         return res.status(400).json({ message: 'All required fields must be filled' });
//     }

//     // Generate a unique Job ID
//     const jobId = uuidv4();

//     // Create a new job entry
//     const newJob = new Job({
//         jobId,
//         title,
//         companyName,
//         companyId,
//         location,
//         description,
//         skillsRequired,
//         jobType,
//         experience,
//         salaryRange
//     });

//     // Save job to database
//     await newJob.save();

//     console.log("✅ Job created successfully:", newJob);

//     res.status(201).json({ message: 'Job created successfully', job: newJob });
// }));
module.exports = companyApp;
