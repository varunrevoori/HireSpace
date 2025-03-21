"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import MockTestCard from "../MockTestCard/MockTestCard"
import "./MockTestListing.css"

function MockTestListing() {
  const [mockTests, setMockTests] = useState([])
  const [filteredMockTests, setFilteredMockTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [domainFilter, setDomainFilter] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [categories, setCategories] = useState([])
  const [domains, setDomains] = useState([])
  const [difficulties] = useState(["Beginner", "Intermediate", "Advanced"]) // From schema

  const location = useLocation()
  const navigate = useNavigate()

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const search = params.get("search") || ""
    const categoryParam = params.get("category") || ""
    const domainParam = params.get("domain") || ""
    const difficultyParam = params.get("difficulty") || ""

    setSearchTerm(search)
    setCategoryFilter(categoryParam)
    setDomainFilter(domainParam)
    setDifficultyFilter(difficultyParam)
  }, [location.search])

  // Fetch mock tests data
  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await fetch("http://localhost:5001/apis/mocktests/")
        const data = await response.json()
        setMockTests(data)

        // Extract unique categories and domains
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
        console.error("Error fetching mock tests:", error)
        setLoading(false)
      }
    }

    fetchMockTests()
  }, [])

  // Filter mock tests based on search parameters
  useEffect(() => {
    if (mockTests.length === 0) return

    const filtered = mockTests.filter((test) => {
      const matchesSearch = searchTerm
        ? test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.domain.toLowerCase().includes(searchTerm.toLowerCase())
        : true

      const matchesCategory = categoryFilter ? test.category === categoryFilter : true
      const matchesDomain = domainFilter ? test.domain === domainFilter : true
      const matchesDifficulty = difficultyFilter ? test.difficulty === difficultyFilter : true

      return matchesSearch && matchesCategory && matchesDomain && matchesDifficulty
    })

    setFilteredMockTests(filtered)
  }, [mockTests, searchTerm, categoryFilter, domainFilter, difficultyFilter])

  const handleFilterChange = () => {
    // Update URL with new filter parameters
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (categoryFilter) params.append("category", categoryFilter)
    if (domainFilter) params.append("domain", domainFilter)
    if (difficultyFilter) params.append("difficulty", difficultyFilter)

    navigate(`/mocktests?${params.toString()}`)
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setCategoryFilter("")
    setDomainFilter("")
    setDifficultyFilter("")
    navigate("/mocktests")
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="results-title">Mock Test Listings</h1>
        <button className="btn btn-outline-primary" onClick={() => navigate("/")}>
          <i className="bi bi-arrow-left me-2"></i>Back to Home
        </button>
      </div>

      {/* Filter sidebar and results */}
      <div className="row">
        {/* Filters sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card filter-card">
            <div className="card-body">
              <h5 className="card-title mb-3">Refine Results</h5>

              <div className="mb-3">
                <label className="form-label">Search</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search tests, domains..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
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

              <div className="mb-3">
                <label className="form-label">Domain</label>
                <select
                  className="form-select"
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

              <div className="mb-3">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-select"
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

              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleFilterChange}>
                  Apply Filters
                </button>
                <button className="btn btn-outline-secondary" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-lg-9">
          <div className="results-header mb-4">
            <h2 className="section-title">
              Available Mock Tests <span className="badge bg-primary ms-2">{filteredMockTests.length}</span>
            </h2>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="sortDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Sort by
              </button>
              <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                <li>
                  <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                    Rating: High to Low
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                    Difficulty: Easy to Hard
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Fetching mock tests...</p>
            </div>
          ) : filteredMockTests.length > 0 ? (
            <div className="row">
              {filteredMockTests.map((test) => (
                <div key={test.mockTestId} className="col-lg-6 col-md-6 mb-4">
                  <MockTestCard test={test} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-light rounded">
              <i className="bi bi-search display-1 text-muted"></i>
              <h3 className="mt-3">No mock tests found</h3>
              <p className="text-muted">Try adjusting your search filters</p>
              <button className="btn btn-primary mt-3" onClick={handleResetFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MockTestListing