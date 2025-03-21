"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./MockTestTake.css"

function MockTestTake({ setShowLogin, isLoggedIn, user }) {
  const { mockTestId } = useParams()
  const navigate = useNavigate()
  const [mockTest, setMockTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)

  // Fetch mock test details
  useEffect(() => {
    const fetchMockTestDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/apis/mocktests/${mockTestId}`)
        if (!response.ok) {
          throw new Error("Mock test not found")
        }
        const data = await response.json()
        setMockTest(data)
        setTimeLeft(data.timeLimit * 60) // Convert minutes to seconds
        setLoading(false)
      } catch (error) {
        console.error("Error fetching mock test details:", error)
        setError("Failed to load mock test details. Please try again later.")
        setLoading(false)
      }
    }

    if (mockTestId) {
      fetchMockTestDetails()
    }
  }, [mockTestId])

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit(new Event("submit")) // Auto-submit when time is up
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Calculate score
      let score = 0
      const answerDetails = mockTest.questions.map((question) => {
        const userAnswer = answers[question._id] || ""
        let isCorrect = false
        if (question.type === "multiple-choice") {
          isCorrect = userAnswer === question.correctAnswer
        } else {
          // For coding questions, this would require backend evaluation
          isCorrect = false // Placeholder
        }
        if (isCorrect) {
          score += question.maxScore
        }
        return {
          questionId: question._id,
          answer: userAnswer,
          isCorrect,
          score: isCorrect ? question.maxScore : 0,
        }
      })

      const response = await fetch("http://localhost:5001/apis/mocktests/attempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.email, // Assuming user object has email
          mockTestId: mockTest._id,
          score,
          totalMarks: mockTest.totalMarks,
          answers: answerDetails,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit test")
      }

      setSuccess(true)
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error submitting test:", error)
      setError(error.message || "Failed to submit test. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading mock test details...</p>
      </div>
    )
  }

  if (error && !mockTest) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/mocktests")}>
          Back to Mock Tests
        </button>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {success ? (
            <div className="card test-success-card">
              <div className="card-body text-center py-5">
                <div className="success-icon mb-4">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h2 className="mb-3">Test Submitted!</h2>
                <p className="mb-4">
                  Your attempt for <strong>{mockTest.name}</strong> has been successfully submitted. Check your results in your dashboard.
                </p>
                <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                  <button className="btn btn-primary" onClick={() => navigate("/mocktests")}>
                    Browse More Tests
                  </button>
                  <button className="btn btn-outline-primary" onClick={() => navigate("/dashboard")}>
                    View My Attempts
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="test-title">Take Mock Test</h1>
                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                  <i className="bi bi-arrow-left me-2"></i>Back
                </button>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="test-image me-3">
                      <img
                        src={mockTest.image || "/placeholder.svg"}
                        alt={mockTest.name}
                        width={64}
                        height={64}
                        className="img-fluid"
                      />
                    </div>
                    <div>
                      <h2 className="test-title mb-1">{mockTest.name}</h2>
                      <p className="domain-name mb-0">
                        {mockTest.domain} • {mockTest.difficulty}
                      </p>
                    </div>
                    <div className="ms-auto">
                      <span className="badge bg-warning text-dark">
                        Time Left: {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}

              <div className="card">
                <div className="card-body">
                  <h3 className="card-title mb-4">Questions</h3>
                  <form onSubmit={handleSubmit}>
                    {mockTest.questions.map((question, index) => (
                      <div key={question._id} className="mb-4">
                        <h5>
                          {index + 1}. {question.question} ({question.maxScore} marks)
                        </h5>
                        {question.type === "multiple-choice" ? (
                          <div>
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`question-${question._id}`}
                                  id={`option-${question._id}-${optIndex}`}
                                  value={option}
                                  checked={answers[question._id] === option}
                                  onChange={() => handleAnswerChange(question._id, option)}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`option-${question._id}-${optIndex}`}
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            className="form-control"
                            rows="5"
                            placeholder="Write your code here..."
                            value={answers[question._id] || ""}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          />
                        )}
                      </div>
                    ))}

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Submitting...
                          </>
                        ) : (
                          "Submit Test"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MockTestTake