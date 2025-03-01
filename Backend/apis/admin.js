const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
require('dotenv').config();

const adminApp = express.Router();

// Admin Registration
adminApp.post('/register', expressAsyncHandler(async (req, res) => {
    const { userType, email, password } = req.body;

    if (!userType || !email || !password) {
        return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (userType !== 'admin') {
        return res.status(403).json({ message: 'Invalid user type' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Email is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ userType, email, password: hashedPassword });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
}));

// Admin Login
adminApp.post('/login', expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const dbUser = await Admin.findOne({ email });
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

module.exports = adminApp;
