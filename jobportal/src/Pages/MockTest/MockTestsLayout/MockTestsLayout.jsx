"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MockTestCategory from "../MockTestsCategories/MockTestCategories"  
import "./MockTestLayout.css"

function MockTestLayout() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [domainFilter, setDomainFilter] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [categories, setCategories] = useState([])
  const [domains, setDomains] = useState([])
  const [difficulties] = useState(["Beginner", "Intermediate", "Advanced"])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/apis/mocktests/")
        const data = await response.json()

        const uniqueCategories = [...new Set(data.map((test) => test.category))]
        const categoriesWithCount = uniqueCategories.map((category) => {
          const count = data.filter((test) => test.category === category).length
          return { name: category, count }
        })
        setCategories(categoriesWithCount)

        const uniqueDomains = [...new Set(data.map((test) => test.domain))]
        setDomains(uniqueDomains)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (categoryFilter) params.append("category", categoryFilter)
    if (domainFilter) params.append("domain", domainFilter)
    if (difficultyFilter) params.append("difficulty", difficultyFilter)

    navigate(`/mocktests?${params.toString()}`)
  }

  return (
    <main className="container py-4">
      <div className="mocktest-header text-center mb-5">
        <h1 className="display-4 fw-bold">Practice with Mock Tests</h1>
        <p className="lead text-muted">Enhance your skills with our curated mock tests</p>
      </div>

      <div className="card mb-5 search-card">
        <div className="card-body p-4">
          <form onSubmit={handleSearch}>
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="input-group search-input">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search tests, domains..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <select
                  className="form-select form-select-lg"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select form-select-lg"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                >
                  <option value="">All Domains</option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 mb-3 mb-md-0">
                <select
                  className="form-select form-select-lg"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3 text-md-end">
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  <i className="bi bi-search me-2"></i>
                  Search Tests
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <MockTestCategory categories={categories} loading={loading} />
    </main>
  )
}

export default MockTestLayout