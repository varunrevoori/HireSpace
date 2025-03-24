"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Controlled as CodeMirror } from "react-codemirror2"
import "codemirror/mode/javascript/javascript"
import "codemirror/theme/material.css"
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(null)
  const [cheatingWarning, setCheatingWarning] = useState(false)
  const [codeOutput, setCodeOutput] = useState("")
  const [codeRunning, setCodeRunning] = useState(false)

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
        setTimeLeft(data.timeLimit * 60)
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

  // Check if NeoShield (or similar) extension is installed
  useEffect(() => {
    const checkNeoShield = () => {
      // Placeholder; replace with actual NeoShield API check
      const isNeoShieldInstalled = window.neoShield?.isInstalled || false
      if (!isNeoShieldInstalled) {
        setError(
          "Please install the NeoShield extension to take the test. " +
            "Visit <a href='https://neoshield.com/download' target='_blank'>NeoShield website</a> to download and install the extension."
        )
        setLoading(false)
      }
    }

    if (!success && !error && !loading) {
      checkNeoShield()
    }
  }, [success, error, loading])

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit(new Event("submit"))
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Anti-copy measures (fallback if NeoShield is not installed)
  useEffect(() => {
    if (!success && !error) {
      const handleCopyPaste = (e) => {
        e.preventDefault()
        setCheatingWarning(true)
      }

      const handleContextMenu = (e) => {
        e.preventDefault()
        setCheatingWarning(true)
      }

      const handleSelectStart = (e) => {
        e.preventDefault()
      }

      const detectDevTools = () => {
        const threshold = 160
        if (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
        ) {
          setCheatingWarning(true)
        }
      }

      document.addEventListener("copy", handleCopyPaste)
      document.addEventListener("paste", handleCopyPaste)
      document.addEventListener("contextmenu", handleContextMenu)
      document.addEventListener("selectstart", handleSelectStart)
      window.addEventListener("resize", detectDevTools)

      return () => {
        document.removeEventListener("copy", handleCopyPaste)
        document.removeEventListener("paste", handleCopyPaste)
        document.removeEventListener("contextmenu", handleContextMenu)
        document.removeEventListener("selectstart", handleSelectStart)
        window.removeEventListener("resize", detectDevTools)
      }
    }
  }, [success, error])

  // Run code using Judge0
  const runCode = async (code) => {
    setCodeRunning(true)
    setCodeOutput("")

    try {
      // Sample test case input (you can store this in the question data)
      const testInput = "hello\nworld" // Example input for a string reversal program

      // Submit code to Judge0
      const response = await fetch("http://localhost:2358/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 63, // JavaScript (Node.js); see Judge0 docs for other language IDs
          stdin: testInput,
          expected_output: "olleh\ndlrow", // Expected output for the test case
        }),
      })

      const { token } = await response.json()

      // Poll for the result
      let result
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second
        const statusResponse = await fetch(`http://localhost:2358/submissions/${token}`)
        result = await statusResponse.json()
        if (result.status.id > 2) break // Status > 2 means the submission is processed
      }

      if (result.status.id === 3) {
        // Accepted
        setCodeOutput(`Success!\nOutput:\n${result.stdout}`)
      } else if (result.status.id === 4) {
        // Wrong Answer
        setCodeOutput(`Wrong Answer\nExpected: ${result.expected_output}\nGot: ${result.stdout}`)
      } else {
        // Error (e.g., compilation error, runtime error)
        setCodeOutput(`Error: ${result.status.description}\n${result.stderr || ""}`)
      }
    } catch (error) {
      console.error("Error running code:", error)
      setCodeOutput("Failed to run code. Please try again.")
    } finally {
      setCodeRunning(false)
    }
  }

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

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index)
    setCodeOutput("") // Clear code output when switching questions
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCodeOutput("") // Clear code output when moving to the next question
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setCodeOutput("") // Clear code output when moving to the previous question
    }
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
      let score = 0
      const answerDetails = mockTest.questions.map((question) => {
        const userAnswer = answers[question._id] || ""
        let isCorrect = false
        if (question.type === "multiple-choice") {
          isCorrect = userAnswer === question.correctAnswer
        } else {
          isCorrect = false // For coding questions, you'd need a judging system
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
          username: user.email,
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

      setScore(score)
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

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <div dangerouslySetInnerHTML={{ __html: error }} />
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
        <div className="col-12">
          {success ? (
            <div className="card test-success-card">
              <div className="card-body text-center py-5">
                <div className="success-icon mb-4">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h2 className="mb-3">Test Submitted!</h2>
                <p className="mb-4">
                  Your attempt for <strong>{mockTest.name}</strong> has been successfully submitted.
                  <br />
                  You scored <strong>{score}</strong> out of <strong>{mockTest.totalMarks}</strong>.
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
              {/* Cheating Warning Modal */}
              {cheatingWarning && (
                <div className="cheating-warning-modal">
                  <div className="cheating-warning-content">
                    <h3>Warning: Cheating Detected</h3>
                    <p>
                      Copying, pasting, or using developer tools is not allowed during the test.
                      Please refrain from such activities to avoid disqualification.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setCheatingWarning(false)}
                    >
                      I Understand
                    </button>
                  </div>
                </div>
              )}

              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="test-title">{mockTest.name}</h1>
                <div className="timer-section">
                  <span className="badge bg-warning text-dark">
                    Time Left: {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="row">
                {/* Left Sidebar: Question Navigation */}
                <div className="col-md-3 mb-4">
                  <div className="card question-nav-card">
                    <div className="card-body">
                      <h5 className="card-title mb-3">Questions</h5>
                      <div className="question-nav">
                        {mockTest.questions.map((question, index) => (
                          <button
                            key={question._id}
                            className={`btn btn-outline-primary question-btn ${
                              currentQuestionIndex === index ? "active" : ""
                            } ${answers[question._id] ? "answered" : ""}`}
                            onClick={() => handleQuestionSelect(index)}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Current Question */}
                <div className="col-md-9">
                  <div className="card question-card">
                    <div className="card-body">
                      <h5 className="card-title mb-4">
                        Question {currentQuestionIndex + 1} of {mockTest.questions.length} (
                        {mockTest.questions[currentQuestionIndex].maxScore} marks)
                      </h5>
                      <p>{mockTest.questions[currentQuestionIndex].question}</p>

                      {mockTest.questions[currentQuestionIndex].type === "multiple-choice" ? (
                        <div>
                          {mockTest.questions[currentQuestionIndex].options.map((option, optIndex) => (
                            <div key={optIndex} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`question-${mockTest.questions[currentQuestionIndex]._id}`}
                                id={`option-${mockTest.questions[currentQuestionIndex]._id}-${optIndex}`}
                                value={option}
                                checked={
                                  answers[mockTest.questions[currentQuestionIndex]._id] === option
                                }
                                onChange={() =>
                                  handleAnswerChange(
                                    mockTest.questions[currentQuestionIndex]._id,
                                    option
                                  )
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`option-${mockTest.questions[currentQuestionIndex]._id}-${optIndex}`}
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <CodeMirror
                            value={answers[mockTest.questions[currentQuestionIndex]._id] || ""}
                            options={{
                              mode: "javascript",
                              theme: "material",
                              lineNumbers: true,
                            }}
                            onBeforeChange={(editor, data, value) => {
                              handleAnswerChange(mockTest.questions[currentQuestionIndex]._id, value)
                            }}
                          />
                          <button
                            className="btn btn-info mt-3"
                            onClick={() => runCode(answers[mockTest.questions[currentQuestionIndex]._id] || "")}
                            disabled={codeRunning}
                          >
                            {codeRunning ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Running...
                              </>
                            ) : (
                              "Run Code"
                            )}
                          </button>
                          {codeOutput && (
                            <pre className="code-output mt-3">{codeOutput}</pre>
                          )}
                        </>
                      )}

                      {/* Navigation Buttons */}
                      <div className="d-flex justify-content-between mt-4">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestionIndex === 0}
                        >
                          Previous
                        </button>
                        {currentQuestionIndex < mockTest.questions.length - 1 ? (
                          <button className="btn btn-primary" onClick={handleNextQuestion}>
                            Next
                          </button>
                        ) : (
                          <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={submitting}
                          >
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
                        )}
                      </div>
                    </div>
                  </div>
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