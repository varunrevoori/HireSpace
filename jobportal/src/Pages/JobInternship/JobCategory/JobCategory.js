"use client"
import { useNavigate } from "react-router-dom"
import "./JobCategory.css"

function JobCategory({ categories, loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <section className="mt-5">
        <h2 className="section-title mb-4">Browse by Category</h2>
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    )
  }

  // Icons mapping for categories
  const getCategoryIcon = (category) => {
    const iconMap = {
      IT: "bi-code-slash",
      Finance: "bi-cash-coin",
      Marketing: "bi-graph-up",
      Healthcare: "bi-heart-pulse",
      Education: "bi-book",
      Engineering: "bi-gear",
      Sales: "bi-cart",
      Design: "bi-palette",
      HR: "bi-people",
      Legal: "bi-briefcase",
  "Artificial Intelligence": "bi-cpu",
  DevOps: "bi-cloud-upload",
  FinTech: "bi-currency-bitcoin",
  "Data Science": "bi-bar-chart",
  Cybersecurity: "bi-shield-lock"
     
    }

    return iconMap[category] || "bi-briefcase"
  }

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams()
    params.append("category", category)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <section className="mt-5">
  <h2 className="section-title mb-4">Browse by Category</h2>
  <div className="row">
    {categories.map((category) => (
      <div key={category.name} className="col-6 col-sm-4 col-md-2 mb-4">
        <div className="card category-card h-100" onClick={() => handleCategoryClick(category.name)}>
          <div className="card-body text-center">
            <div className="category-icon mx-auto">
              <i className={`bi ${getCategoryIcon(category.name)}`}></i>
            </div>
            <h6 className="card-title">{category.name}</h6>
            <p className="category-count">{category.count} jobs</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

  )
}

export default JobCategory

