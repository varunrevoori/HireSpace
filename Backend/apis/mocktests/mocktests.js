const express = require('express');
const mocktest = express.Router();
const MockTest = require('../../models/mocktests/mocktestmodel');
const UserAttempt = require('../../models/mocktests/usermocktests');

// Create a new mock test
mocktest.post('/create', async (req, res) => {
    try {
      const { 
        mockTestId, 
        name, 
        image, 
        category, 
        domain, 
        difficulty, 
        totalQuestions, 
        totalMarks, 
        passingMarks, 
        timeLimit, 
        rating, 
        questions 
      } = req.body;
  
      // 🛑 Check if a mock test with the same mockTestId already exists
      const existingMockTest = await MockTest.findOne({ mockTestId });
      if (existingMockTest) {
        return res.status(400).json({ 
          message: `Mock test with ID "${mockTestId}" already exists` 
        });
      }
  
      // ✅ Create a new mock test
      const mockTest = new MockTest({
        mockTestId,
        name,
        image: image || '/placeholder.svg',
        category,
        domain,
        difficulty,
        totalQuestions,
        totalMarks,
        passingMarks,
        timeLimit,
        rating: rating || 0,
        questions
      });
  
      await mockTest.save();
      res.status(201).json({ message: 'Mock test created successfully', mockTest });
  
    } catch (error) {
      res.status(500).json({ message: 'Error creating mock test', error: error.message });
    }
  });
  

// Get all mock tests
mocktest.get('/', async (req, res) => {
  try {
    const mockTests = await MockTest.find();
    res.json(mockTests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mock tests', error: error.message });
  }
});

// Get a specific mock test by ID
mocktest.get('/:id', async (req, res) => {
  try {
    const mockTest = await MockTest.findById(req.params.id);
    if (!mockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json(mockTest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mock test', error: error.message });
  }
});

// Update a mock test
mocktest.put('/update/:id', async (req, res) => {
  try {
    const updatedMockTest = await MockTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json({ message: 'Mock test updated successfully', updatedMockTest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating mock test', error: error.message });
  }
});

// Delete a mock test
mocktest.delete('/delete/:id', async (req, res) => {
  try {
    const deletedMockTest = await MockTest.findByIdAndDelete(req.params.id);
    if (!deletedMockTest) return res.status(404).json({ message: 'Mock test not found' });
    res.json({ message: 'Mock test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mock test', error: error.message });
  }
});

// Submit a mock test attempt
mocktest.post('/attempt', async (req, res) => {
    const { username, mockTestId, score, totalMarks, answers } = req.body;
    try {
      // 🛑 Fix: Use `findOne({ mockTestId })` instead of `findById(mockTestId)`
      const mockTest = await MockTest.findOne({ mockTestId });
      if (!mockTest) return res.status(404).json({ message: 'Mock test not found' });
  
      const passed = score >= mockTest.passingMarks;
      const progress = (score / totalMarks) * 100;
  
      const attempt = new UserAttempt({
        username,
        mockTestId,
        score,
        totalMarks,
        passed,
        progress,
        answers,
      });
      await attempt.save();
  
      res.json({ message: 'Attempt submitted successfully', attempt });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting attempt', error: error.message });
    }
  });
  

// Get user attempt history by username
mocktest.get('/attempts/:username', async (req, res) => {
  try {
    const attempts = await UserAttempt.find({ username: req.params.username }).populate('mockTestId');
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempt history', error: error.message });
  }
});

module.exports = mocktest;