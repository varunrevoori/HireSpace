"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import JobCard from "../JobCard/JobCard"
import "./JobListing.css"

function JobListing() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("") // New company filter
  const [salaryRange, setSalaryRange] = useState([0, 10000000])
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [companies, setCompanies] = useState([]) // Store all companies for filter

  const location = useLocation()
  const navigate = useNavigate()

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const search = params.get("search") || ""
    const locationParam = params.get("location") || ""
    const categoryParam = params.get("category") || ""
    const companyParam = params.get("company") || "" // Get company from URL params
    const minSalary = Number.parseInt(params.get("minSalary") || "0")
    const maxSalary = Number.parseInt(params.get("maxSalary") || "10000000")

    setSearchTerm(search)
    setLocationFilter(locationParam)
    setCategoryFilter(categoryParam)
    setCompanyFilter(companyParam) // Set company filter from URL
    setSalaryRange([minSalary, maxSalary])
  }, [location.search])

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5001/apis/job/joblisting")
        const data = await response.json()
        setJobs(data)

        // Extract unique locations and categories
        const uniqueLocations = [...new Set(data.map((job) => job.location))]
        setLocations(uniqueLocations)

        const uniqueCategories = [...new Set(data.map((job) => job.category))]
        const categoriesWithCount = uniqueCategories.map((category) => {
          const count = data.filter((job) => job.category === category).length
          return { name: category, count }
        })
        setCategories(categoriesWithCount)

        // Extract unique companies
        const uniqueCompanies = [...new Set(data.map((job) => job.company))]
        setCompanies(uniqueCompanies)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs based on search parameters
  useEffect(() => {
    if (jobs.length === 0) return

    const filtered = jobs.filter((job) => {
      const matchesSearch = searchTerm
        ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true

      const matchesLocation = locationFilter ? job.location === locationFilter : true

      const matchesCategory = categoryFilter ? job.category === categoryFilter : true

      // Add company filter
      const matchesCompany = companyFilter ? job.company === companyFilter : true

      // Check if job salary range overlaps with filter range
      const jobMinSalary = job.salaryRange[0]
      const jobMaxSalary = job.salaryRange[1]
      const matchesSalary = jobMinSalary <= salaryRange[1] && jobMaxSalary >= salaryRange[0]

      return matchesSearch && matchesLocation && matchesCategory && matchesCompany && matchesSalary
    })

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, locationFilter, categoryFilter, companyFilter, salaryRange])

  const handleSalaryRangeChange = (event) => {
    const { name, value } = event.target
    if (name === "minSalary") {
      setSalaryRange([Number.parseInt(value), salaryRange[1]])
    } else {
      setSalaryRange([salaryRange[0], Number.parseInt(value)])
    }
  }

  const handleFilterChange = () => {
    // Update URL with new filter parameters
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (locationFilter) params.append("location", locationFilter)
    if (categoryFilter) params.append("category", categoryFilter)
    if (companyFilter) params.append("company", companyFilter) // Add company to URL params
    params.append("minSalary", salaryRange[0])
    params.append("maxSalary", salaryRange[1])

    navigate(`/jobs?${params.toString()}`)
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setCategoryFilter("")
    setCompanyFilter("") // Reset company filter
    setSalaryRange([0, 10000000])
    navigate("/jobs")
  }

  const formatSalary = (salary) => {
    if (salary >= 10000000) return "1 Cr+"
    if (salary >= 100000) return `${(salary / 100000).toFixed(1)} Lakh`
    return `₹${salary.toLocaleString()}`
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="results-title">Job Search Results</h1>
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
                    placeholder="Keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <select
                  className="form-select"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
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

              {/* Add company filter */}
              <div className="mb-3">
                <label className="form-label">Company</label>
                <select
                  className="form-select"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option value="">All Companies</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Salary Range</label>
                <div className="d-flex justify-content-between mb-2">
                  <span className="small">{formatSalary(salaryRange[0])}</span>
                  <span className="small">to</span>
                  <span className="small">{formatSalary(salaryRange[1])}</span>
                </div>

                <div className="mb-3">
                  <label htmlFor="resultMinSalary" className="form-label small">
                    Min Salary
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="resultMinSalary"
                    name="minSalary"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={salaryRange[0]}
                    onChange={handleSalaryRangeChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="resultMaxSalary" className="form-label small">
                    Max Salary
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="resultMaxSalary"
                    name="maxSalary"
                    min="0"
                    max="10000000"
                    step="100000"
                    value={salaryRange[1]}
                    onChange={handleSalaryRangeChange}
                  />
                </div>
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
              Available Positions <span className="badge bg-primary ms-2">{filteredJobs.length}</span>
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
                  <a className="dropdown-item" href="#">
                    Newest
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Salary: High to Low
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Salary: Low to High
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
              <p className="mt-3 text-muted">Fetching job opportunities...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="row">
              {filteredJobs.map((job) => (
                <div key={job.jobId} className="col-lg-6 col-md-6 mb-4">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 bg-light rounded">
              <i className="bi bi-search display-1 text-muted"></i>
              <h3 className="mt-3">No jobs found</h3>
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

export default JobListing

