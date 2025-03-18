import "./JobCard.css"

function JobCard({ job }) {
  // Format salary range
  const formatSalary = (salary) => {
    if (salary >= 10000000) return "1 Cr+"
    if (salary >= 100000) return `${(salary / 100000).toFixed(1)} Lakh`
    return `₹${salary.toLocaleString()}`
  }

  const minSalary = formatSalary(job.salaryRange[0])
  const maxSalary = formatSalary(job.salaryRange[1])

  return (
    <div className="card job-card h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="company-logo me-3">
            {job.companyLogo ? (
              <img
                src={job.companyLogo || "/placeholder.svg"}
                alt={job.company}
                width={48}
                height={48}
                className="img-fluid"
              />
            ) : (
              <div className="company-initial">{job.company.charAt(0)}</div>
            )}
          </div>
          <div>
            <h5 className="card-title mb-0">{job.title}</h5>
            <p className="company-name mb-0">{job.company}</p>
          </div>
          <div className="ms-auto">
            <span className={`badge ${job.jobType === "Internship" ? "bg-info" : "bg-primary"}`}>{job.jobType}</span>
          </div>
        </div>

        <div className="job-details mb-3">
          <div className="job-detail">
            <i className="bi bi-geo-alt"></i>
            <span>{job.location}</span>
          </div>
          <div className="job-detail">
            <i className="bi bi-briefcase"></i>
            <span>{job.experience}</span>
          </div>
          <div className="job-detail">
            <i className="bi bi-currency-rupee"></i>
            <span>
              {minSalary} - {maxSalary}
            </span>
          </div>
        </div>

        <p className="card-text description">{job.description}</p>

        <div className="skills-container mb-3">
          {job.skillsRequired.map((skill) => (
            <span key={skill} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="card-footer bg-white border-top-0 pt-0">
        <button className="btn btn-primary w-100">
          <i className="bi bi-send me-2"></i>
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default JobCard

