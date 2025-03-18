"use client"
import { useNavigate } from "react-router-dom"
import "./JobCompanies.css"

function JobCompanies({ industries, loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <section className="mt-5">
        <h2 className="section-title mb-4">Top Companies Actively Hiring</h2>
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    )
  }
 
  const handleCompanyClick = (companyName, category) => {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("company", companyName); // Add company parameter
    navigate(`/jobs?${params.toString()}`);
  }

  const handleViewAll = (industry) => {
    const params = new URLSearchParams()
    params.append("category", industry)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <section className="mt-5">
      <h2 className="section-title mb-4">Top Companies Actively Hiring</h2>

      {industries.map((industry) => (
        <div key={industry.name} className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <h3 className="h5 mb-0">{industry.name}</h3>
            <div className="industry-line flex-grow-1 mx-3"></div>
            <a
              href="#"
              className="view-all"
              onClick={(e) => {
                e.preventDefault()
                handleViewAll(industry.name)
              }}
            >
              View All
            </a>
          </div>
          <div className="row">
            {industry.companies.map((company) => (
              <div key={company.name} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card company-card h-100" onClick={() => handleCompanyClick(company.name, industry.name)}>
                  <div className="card-body d-flex align-items-center">
                    <div className="company-logo me-3">
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        width={48}
                        height={48}
                        className="img-fluid"
                      />
                    </div>
                    <div>
                      <h5 className="card-title">{company.name}</h5>
                      <div className="d-flex align-items-center">
                        <span className="company-jobs">View open positions</span>
                        <i className="bi bi-arrow-right ms-2"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default JobCompanies
