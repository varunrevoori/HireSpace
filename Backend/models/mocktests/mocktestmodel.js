const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['multiple-choice', 'coding'], required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
  maxScore: { type: Number, required: true },
});

const mockTestSchema = new mongoose.Schema({
  mockTestId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, default: '/placeholder.svg' },
  category: { type: String, required: true },
  domain: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  timeLimit: { type: Number, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  questions: [questionSchema],
});

module.exports = mongoose.model('MockTest', mockTestSchema);