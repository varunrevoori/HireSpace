const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const Student = require('../models/studentmodel');
require('dotenv').config();
const JobApplication = require('../models/jobstatusmodel');

const studentApp = express.Router();

studentApp.post('/register', expressAsyncHandler(async (req, res) => {
    const { userType, username, email, password, skills = [], education = [], projects = [] } = req.body;

    if (!userType || !email || !password || (userType === "student" && !username)) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const existingUser = await Student.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ message: existingUser.email === email ? 'Email is already taken' : 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Student({ userType, username, email, password: hashedPassword, skills, education, projects });

    await newUser.save();
    res.status(201).json({ message: 'Student registered successfully' });
}));

// Student Login
studentApp.post('/login', expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const dbUser = await Student.findOne({ email });
    if (!dbUser) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Incorrect password' });
    }

    if (!process.env.SECRET_KEY) {
        return res.status(500).json({ message: 'Server error: SECRET_KEY not defined' });
    }

    const token = jwt.sign(
        { userId: dbUser._id, email: dbUser.email, userType: dbUser.userType },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, user: { email: dbUser.email, userType: dbUser.userType } });
}));

module.exports = studentApp;
