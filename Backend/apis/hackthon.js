const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Hackathon = require('../models/hackthonmodel');
const { router } = require('./githubAuth');
const verifytoken = require('../middlewares/verifytoken');
const { verify } = require('jsonwebtoken');

const hackathonapp = express.Router();

// ✅ Create Hackathon (Admin or Company)
hackathonapp.post('/create', async (req, res) => {
    try {
        const { title, problemStatement, domain, companyId, deadline,hackathonId } = req.body;
       

        const newHackathon = new Hackathon({
            title, problemStatement, domain, companyId, deadline, hackathonId
        });

        await newHackathon.save();

        res.status(201).json({ message: 'Hackathon created successfully!', hackathonId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating hackathon', error: error.message });
    }
});

// ✅ Participate in Hackathon (Prevent Duplicate Entries)
hackathonapp.put('/participate', async (req, res) => {
    try {
        const { username, hackathonId, gitRepository } = req.body;
        
        const hackathon = await Hackathon.findOne({ hackathonId });
        if (!hackathon) return res.status(404).json({ message: 'Hackathon not found!' });

        // Check if the user is already a participant
        const isAlreadyParticipated = hackathon.participants.some(p => p.username === username);
        if (isAlreadyParticipated) {
            return res.status(400).json({ message: 'User has already participated in this hackathon!' });
        }

        // Add new participant
        hackathon.participants.push({ username, gitRepository });
        hackathon.totalParticipants = hackathon.participants.length;
        await hackathon.save();

        res.status(200).json({ message: 'Participant added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding participant', error: error.message });
    }
});


<<<<<<< HEAD
// ✅ Submit Hackathon Solution
hackathonapp.put('/submit', async (req, res) => {
=======
hackathonapp.put('/submit',verifytoken, async (req, res) => {
>>>>>>> b7fbea04f61f5fd7bf395b546ac213d0d07f0bb3
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
hackathonapp.put('/end/:hackathonId', async (req, res) => {
    try {
        const { hackathonId } = req.params;
        const { companyId, admin } = req.body; // Verify admin or company

        const hackathon = await Hackathon.findOne({ hackathonId });
        if (!hackathon) return res.status(404).json({ message: 'Hackathon not found!' });

        // ❌ Only the company or admin can end the hackathon
        if (hackathon.companyId !== companyId && !admin) {
            return res.status(403).json({ message: 'Only the admin or company can end this hackathon!' });
        }

        // ✅ Update top performers before marking it as ended
        updateTopPerformers(hackathon);

        // ✅ Mark the hackathon as ended
        hackathon.status = "ended";
        await hackathon.save();

        res.status(200).json({ message: "Hackathon has been successfully ended!", topPerformers: hackathon.topPerformers });
    } catch (error) {
        res.status(500).json({ message: 'Error ending hackathon', error: error.message });
    }
});



// ✅ GitHub Score Calculation (With Repository Existence Check)
const calculateGitScore = async (repoLink) => {
    try {
        if (!repoLink) return 0;

        const repoParts = repoLink.split('/');
        const owner = repoParts[repoParts.length - 2];
        const repo = repoParts[repoParts.length - 1];

        const headers = { 
            headers: { 'User-Agent': 'Hackathon-Evaluator' }
        };

        // ✅ Check if the repository exists
        const repoCheck = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, headers);
        if (repoCheck.status !== 200) return 0;

        // ✅ Fetch relevant GitHub data
        const [commits, prs, issues, contributors] = await Promise.all([
            axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, headers),
            axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`, headers),
            axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=all`, headers),
            axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, headers)
        ]);

        // ✅ Define scoring system
        const commitScore = commits.data.length * 2;      // 2 points per commit
        const prScore = prs.data.length * 5;              // 5 points per pull request
        const issueScore = issues.data.length * 3;        // 3 points per issue
        const contributionScore = contributors.data.length * 10; // 10 points per contributor

        const totalScore = commitScore + prScore + issueScore + contributionScore;
        
        return totalScore;
    } catch (error) {
        console.error("GitHub Evaluation Error:", error.message);
        return 0;
    }
};



// ✅ Helper Functions
const calculateDomainScore = async (repoLink) => {
    try {
        const repoParts = repoLink.split('/');
        const owner = repoParts[repoParts.length - 2];
        const repo = repoParts[repoParts.length - 1];

        const headers = { headers: { 'User-Agent': 'Hackathon-Evaluator' } };

        // ✅ Fetch repository details
        const repoCheck = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, headers);
        if (repoCheck.status !== 200) return 0;

        // ✅ Check for README file
        let readmeScore = 0;
        try {
            const readme = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, headers);
            if (readme.data) readmeScore = 20;
        } catch {
            readmeScore = 0; // No README found
        }

        // ✅ Evaluate languages used
        const languages = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, headers);
        let languageScore = Object.keys(languages.data).length * 5; // More languages = more versatility

        return Math.min(100, readmeScore + languageScore); // Ensure max score is 100
    } catch (error) {
        console.error("Error calculating domain score:", error.message);
        return 0;
    }
};


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
