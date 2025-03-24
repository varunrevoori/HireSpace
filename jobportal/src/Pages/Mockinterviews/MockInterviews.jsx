import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: ''
  });
  const [interviewState, setInterviewState] = useState({
    active: false,
    jobId: null,
    currentQuestion: '',
    answers: [],
    feedback: [],
    score: 0
  });
  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      setJobs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/jobs', formData);
      setFormData({ title: '', company: '', location: '', description: '' });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const startMockInterview = async (jobId) => {
    try {
      const response = await axios.post('/api/jobs/mock-interview/start', { jobId });
      setInterviewState({
        active: true,
        jobId,
        currentQuestion: response.data.question,
        answers: [],
        feedback: [],
        score: 0
      });
      setCurrentAnswer('');
    } catch (err) {
      console.error(err);
    }
  };

  const submitAnswer = async () => {
    try {
      const response = await axios.post('/api/jobs/mock-interview/answer', {
        question: interviewState.currentQuestion,
        answer: currentAnswer
      });
      const { feedback, followUp } = response.data;

      // Extract score from feedback (assuming it’s in the format "Score: X/10")
      const scoreMatch = feedback.match(/Score: (\d+)\/10/);
      const newScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

      setInterviewState(prev => ({
        ...prev,
        currentQuestion: followUp,
        answers: [...prev.answers, currentAnswer],
        feedback: [...prev.feedback, feedback],
        score: prev.score + newScore
      }));
      setCurrentAnswer('');
    } catch (err) {
      console.error(err);
    }
  };

  const endInterview = () => {
    setInterviewState({ active: false, jobId: null, currentQuestion: '', answers: [], feedback: [], score: 0 });
  };

  return (
    <div className="App">
      <h1>HireSpace</h1>

      {/* Job Posting Form */}
      {!interviewState.active && (
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
          <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
          <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <button type="submit">Post Job</button>
        </form>
      )}

      {/* Job Listings */}
      {!interviewState.active && (
        <>
          <h2>Job Listings</h2>
          <ul>
            {jobs.map(job => (
              <li key={job._id}>
                <strong>{job.title}</strong> at {job.company} - {job.location}
                <p>{job.description}</p>
                <button onClick={() => startMockInterview(job._id)}>Start Mock Interview</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Mock Interview Section */}
      {interviewState.active && (
        <div className="mock-interview">
          <h2>Mock Interview</h2>
          <p><strong>Current Question:</strong> {interviewState.currentQuestion}</p>
          <textarea
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
          />
          <button onClick={submitAnswer} disabled={!currentAnswer}>Submit Answer</button>
          <button onClick={endInterview}>End Interview</button>

          {/* Display Previous Q&A and Feedback */}
          {interviewState.answers.length > 0 && (
            <div className="interview-history">
              <h3>Interview History</h3>
              {interviewState.answers.map((answer, index) => (
                <div key={index}>
                  <p><strong>Q{index + 1}:</strong> {interviewState.feedback[index].split('\n')[0]}</p>
                  <p><strong>Your Answer:</strong> {answer}</p>
                  <p><strong>Feedback:</strong> {interviewState.feedback[index]}</p>
                </div>
              ))}
              <p><strong>Total Score:</strong> {interviewState.score}/{interviewState.answers.length * 10}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;