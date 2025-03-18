import "./JobCompanies.css";

export default function JobCompanies({ industries, loading }) {
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
    );
  }

  return (
    <section className="mt-5">
      <h2 className="section-title mb-4">Top Companies Actively Hiring</h2>

      {industries.map((industry) => (
        <div key={industry.name} className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <h3 className="h5 mb-0">{industry.name}</h3>
            <div className="industry-line flex-grow-1 mx-3"></div>
            <a href="#" className="view-all">
              View All
            </a>
          </div>
          <div className="row">
            {industry.companies.map((company) => (
              <div key={company.name} className="col-md-4 mb-4">
                <div className="card company-card h-100">
                  <div className="card-body d-flex align-items-center">
                    <div className="company-logo me-3">
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={company.name}
                        width="48"
                        height="48"
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
  );
}
