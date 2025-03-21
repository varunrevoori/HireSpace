const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'coding'], required: true },
  selectedAnswer: { type: String },
  codeSubmission: { type: String },
  isCorrect: { type: Boolean, required: true },
  score: { type: Number, required: true },
});

const userAttemptSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Replace userId with username
  mockTestId: { type: String, ref: 'MockTest', required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  dateAttempted: { type: Date, default: Date.now },
  progress: { type: Number, min: 0, max: 100 },
  answers: [answerSchema],
});

module.exports = mongoose.model('UserAttempt', userAttemptSchema);