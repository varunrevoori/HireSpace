const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Hackathon = require('../models/hackthonmodel');

const hackathonapp = express.Router();


// Create a Hackathon
hackathonapp.post('/create', async (req, res) => {
    try {
        const { title, problemStatement, domain, companyId, deadline, hackathonId } = req.body;

        const newHackathon = new Hackathon({
            title,
            problemStatement,
            domain,
            companyId,
            deadline,
            hackathonId
        });

        await newHackathon.save();

        res.status(201).json({ 
            message: 'Hackathon created successfully!',
            // hackathonId: newHackathon.hackathonId, 
            // hackathon: newHackathon 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating hackathon', error: error.message });
    }
});



 const mongoose = require('mongoose');
// const Hackathon = require('../models/hackthonmodel');

// ✅ Add Participant to a Hackathon
hackathonapp.put('/participate', async (req, res) => {
    try {
        const { username, hackathonId, gitRepository } = req.body;

        if (!hackathonId || !username || !gitRepository) {
            return res.status(400).json({ message: 'Hackathon ID, username, and GitHub repo are required.' });
        }

        // Find the hackathon by hackathonId
        const hackathon = await Hackathon.findOne({ hackathonId });

        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found!' });
        }

        // Check if the participant already exists
        const existingParticipant = hackathon.participants.find(p => p.username === username);
        if (existingParticipant) {
            return res.status(400).json({ message: 'User already registered for this hackathon!' });
        }

        // ✅ Add participant
        hackathon.participants.push({ username, gitRepository });
        hackathon.totalParticipants = hackathon.participants.length; // Update participant count
        await hackathon.save();

        res.status(200).json({ 
            message: 'Participant added successfully!', 
            hackathonId: hackathon.hackathonId,
            totalParticipants: hackathon.totalParticipants,
            participant: { username, gitRepository }
        });
    } catch (error) {
        console.error('❌ Error adding participant:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

hackathonapp.put('/submit', async (req, res) => {
    try {
        const { hackathonId, username } = req.body;

        if (!hackathonId || !username) {
            return res.status(400).json({ message: 'Hackathon ID and username are required.' });
        }

        // Find the hackathon
        const hackathon = await Hackathon.findOne({ hackathonId });

        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found!' });
        }

        // Find the participant
        const participant = hackathon.participants.find(p => p.username === username);

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found!' });
        }

        // ✅ Calculate scores (Git Score + Domain Score)
        participant.gitScore = calculateGitScore(participant.gitRepository);
        participant.domainScore = calculateDomainScore(participant.gitRepository);
        
        // ✅ Save updated participant data
        await hackathon.save();

        // ✅ Update top performers
        updateTopPerformers(hackathon);

        res.status(200).json({ 
            message: 'Hackathon submitted successfully!',
            participant,
            topPerformers: hackathon.topPerformers
        });

    } catch (error) {
        console.error('❌ Error submitting hackathon:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
const calculateGitScore = (repoLink) => {
    // Simulate a scoring system based on commits, issues, and PRs
    return Math.floor(Math.random() * 50) + 50; // Random score between 50-100
};
const calculateDomainScore = (repoLink) => {
    // Simulate domain expertise based on file types and structure
    return Math.floor(Math.random() * 30) + 70; // Random score between 70-100
};
const updateTopPerformers = (hackathon) => {
    // Sort participants based on total score
    hackathon.participants.sort((a, b) => (b.gitScore + b.domainScore) - (a.gitScore + a.domainScore));

    // Select the top 3 performers
    hackathon.topPerformers = hackathon.participants.slice(0, 3).map(p => ({
        username: p.username,
        justification: `High Git Score: ${p.gitScore}, Domain Score: ${p.domainScore}`
    }));

    hackathon.save();
};
hackathonapp.get('/all', async (req, res) => {
    try {
        const hackathons = await Hackathon.find(); // Fetch all hackathons

        if (!hackathons.length) {
            return res.status(404).json({ message: 'No hackathons found!' });
        }

        res.status(200).json({ 
            message: 'All hackathons retrieved successfully!',
            hackathons
        });
    } catch (error) {
        console.error('❌ Error fetching hackathons:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
hackathonapp.get('/:hackathonId', async (req, res) => {
    try {
        const { hackathonId } = req.params;

        // Find the hackathon by ID
        const hackathon = await Hackathon.findOne({ hackathonId });

        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found!' });
        }

        res.status(200).json({ 
            message: 'Hackathon retrieved successfully!',
            hackathon
        });
    } catch (error) {
        console.error('❌ Error fetching hackathon:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});





module.exports = hackathonapp;
