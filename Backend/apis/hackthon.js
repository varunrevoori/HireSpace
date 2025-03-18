const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Hackathon = require('../models/hackthonmodel');
const { router } = require('./githubAuth');
const verifytoken = require('../middlewares/verifytoken');
const { verify } = require('jsonwebtoken');

const hackathonapp = express.Router();

// ✅ Create Hackathon (Admin or Company)
hackathonapp.post('/create',verifytoken, async (req, res) => {
    try {
        const { title, problemStatement, domain, companyId, deadline } = req.body;
        const hackathonId = new mongoose.Types.ObjectId();

        const newHackathon = new Hackathon({
            title, problemStatement, domain, companyId, deadline, hackathonId
        });

        await newHackathon.save();

        res.status(201).json({ message: 'Hackathon created successfully!', hackathonId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating hackathon', error: error.message });
    }
});

// ✅ Participate in Hackathon
hackathonapp.put('/participate', verifytoken,async (req, res) => {
    try {
        const { username, hackathonId, gitRepository } = req.body;
        
        const hackathon = await Hackathon.findOne({ hackathonId });
        if (!hackathon) return res.status(404).json({ message: 'Hackathon not found!' });

        hackathon.participants.push({ username, gitRepository });
        hackathon.totalParticipants = hackathon.participants.length;
        await hackathon.save();

        res.status(200).json({ message: 'Participant added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding participant', error: error.message });
    }
});


hackathonapp.put('/submit',verifytoken, async (req, res) => {
    try {
        const { hackathonId, username } = req.body;
        const hackathon = await Hackathon.findOne({ hackathonId });
        if (!hackathon) return res.status(404).json({ message: 'Hackathon not found!' });

        const participant = hackathon.participants.find(p => p.username === username);
        if (!participant) return res.status(404).json({ message: 'Participant not found!' });

        participant.gitScore = await calculateGitScore(participant.gitRepository);
        participant.domainScore = calculateDomainScore(participant.gitRepository);
        await hackathon.save();
        updateTopPerformers(hackathon);

        res.status(200).json({ message: 'Hackathon submitted successfully!', participant });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting hackathon', error: error.message });
    }
});

// ✅ GitHub Score Calculation
const calculateGitScore = async (repoLink) => {
    try {
        const repoParts = repoLink.split('/');
        const owner = repoParts[repoParts.length - 2];
        const repo = repoParts[repoParts.length - 1];

        const commits = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
        const prs = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`);
        const issues = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=all`);

        return (commits.data.length * 2) + (prs.data.length * 5) + (issues.data.length * 3);
    } catch (error) {
        return 50;
    }
};

// ✅ Helper Functions
const calculateDomainScore = (repoLink) => Math.floor(Math.random() * 30) + 70;
const updateTopPerformers = (hackathon) => {
    hackathon.participants.sort((a, b) => (b.gitScore + b.domainScore) - (a.gitScore + a.domainScore));
    hackathon.topPerformers = hackathon.participants.slice(0, 3);
    hackathon.save();
};
hackathonapp.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedHackathon = await Hackathon.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedHackathon) {
            return res.status(404).json({ success: false, message: "Hackathon not found" });
        }

        res.json({ success: true, data: updatedHackathon });
    } catch (error) {
        console.error("Error updating hackathon:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


module.exports = hackathonapp;
