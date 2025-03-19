"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./JobApplication.css"

function JobApplication() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    coverLetter: "",
  })
  const [resume, setResume] = useState(null)
  const [resumeError, setResumeError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/apis/job/job/${jobId}`)
        if (!response.ok) {
          throw new Error("Job not found")
        }
        const data = await response.json()
        setJob(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching job details:", error)
        setError("Failed to load job details. Please try again later.")
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleResumeChange = (e) => {
    const file = e.target.files[0]

    // Validate file type
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        setResumeError("Please upload a PDF or Word document")
        setResume(null)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setResumeError("File size should be less than 5MB")
        setResume(null)
        return
      }

      setResumeError("")
      setResume(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!resume) {
      setResumeError("Please upload your resume")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Create form data for file upload
      const applicationData = new FormData()
      applicationData.append("jobId", jobId)
      applicationData.append("fullName", formData.fullName)
      applicationData.append("email", formData.email)
      applicationData.append("phone", formData.phone)
      applicationData.append("experience", formData.experience)
      applicationData.append("coverLetter", formData.coverLetter)
      applicationData.append("resume", resume)

      const response = await fetch("http://localhost:5001/apis/applications/apply", {
        method: "POST",
        body: applicationData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit application")
      }

      setSuccess(true)
      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        experience: "",
        coverLetter: "",
      })
      setResume(null)

      // Scroll to top to show success message
      window.scrollTo(0, 0)
    } catch (error) {
      console.error("Error submitting application:", error)
      setError(error.message || "Failed to submit application. Please try again.")
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
        <p className="mt-3">Loading job details...</p>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
          Back to Job Listings
        </button>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {success ? (
            <div className="card application-success-card">
              <div className="card-body text-center py-5">
                <div className="success-icon mb-4">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h2 className="mb-3">Application Submitted!</h2>
                <p className="mb-4">
                  Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been
                  successfully submitted. We'll notify you about the status of your application.
                </p>
                <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                  <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
                    Browse More Jobs
                  </button>
                  <button className="btn btn-outline-primary" onClick={() => navigate("/dashboard")}>
                    View My Applications
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="application-title">Apply for Job</h1>
                <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
                  <i className="bi bi-arrow-left me-2"></i>Back
                </button>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="company-logo me-3">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo || "/placeholder.svg"}
                          alt={job.company}
                          width={64}
                          height={64}
                          className="img-fluid"
                        />
                      ) : (
                        <div className="company-initial">{job.company}</div>
                      )}
                    </div>
                    <div>
                      <h2 className="job-title mb-1">{job.title}</h2>
                      <p className="company-name mb-0">
                        {job.company} • {job.location}
                      </p>
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
                  <h3 className="card-title mb-4">Personal Information</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="experience" className="form-label">
                        Years of Experience *
                      </label>
                      <select
                        className="form-select"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="0-1 years">0-1 years</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-7 years">5-7 years</option>
                        <option value="7+ years">7+ years</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="resume" className="form-label">
                        Upload Resume *
                      </label>
                      <input
                        type="file"
                        className={`form-control ${resumeError ? "is-invalid" : ""}`}
                        id="resume"
                        onChange={handleResumeChange}
                        accept=".pdf,.doc,.docx"
                      />
                      {resumeError && <div className="invalid-feedback">{resumeError}</div>}
                      <div className="form-text">Accepted formats: PDF, DOC, DOCX. Max size: 5MB</div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="coverLetter" className="form-label">
                        Cover Letter
                      </label>
                      <textarea
                        className="form-control"
                        id="coverLetter"
                        name="coverLetter"
                        rows="5"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        placeholder="Tell us why you're a good fit for this position..."
                      ></textarea>
                    </div>

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
                          "Submit Application"
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

export default JobApplication

