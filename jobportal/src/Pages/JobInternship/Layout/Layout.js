"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import JobCategories from "../JobCategory/JobCategory"
import TopCompanies from "../JobCompanies/JobCompanies"
import "./Layout.css"

function Layout() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("") // New company filter state
  const [salaryRange, setSalaryRange] = useState([0, 10000000])
  const [locations, setLocations] = useState([])
  const [categories, setCategories] = useState([])
  const [companies, setCompanies] = useState([])
  const [allCompanies, setAllCompanies] = useState([]) // Store all companies for filter dropdown
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch jobs data to extract locations, categories, and companies
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/apis/job/joblisting")
        const data = await response.json()

        // Extract unique locations
        const uniqueLocations = [...new Set(data.map((job) => job.location))]
        setLocations(uniqueLocations)

        // Extract unique categories with count
        const uniqueCategories = [...new Set(data.map((job) => job.category))]
        const categoriesWithCount = uniqueCategories.map((category) => {
          const count = data.filter((job) => job.category === category).length
          return { name: category, count }
        })
        setCategories(categoriesWithCount)

        // Extract all unique companies for the company filter
        const uniqueCompanies = [...new Set(data.map((job) => job.company))]
        setAllCompanies(uniqueCompanies)

        // Extract companies grouped by industry (category)
        const companiesData = uniqueCompanies.map((company) => {
          const companyJobs = data.filter((job) => job.company === company)
          const logo = companyJobs[0]?.companyLogo || "/placeholder.svg"
          return { name: company, logo }
        })

        // Group companies by industry (using category as proxy)
        const industries = [...new Set(data.map((job) => job.category))]
        const industriesWithCompanies = industries.map((industry) => {
          const industryJobs = data.filter((job) => job.category === industry)
          const industryCompanies = [...new Set(industryJobs.map((job) => job.company))].map((company) => {
            const companyData = companiesData.find((c) => c.name === company)
            return companyData
          })
          return {
            name: industry,
            companies: industryCompanies.slice(0, 4), // Limit to 4 companies per industry
          }
        })

        setCompanies(industriesWithCompanies)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSalaryRangeChange = (event) => {
    const { name, value } = event.target
    if (name === "minSalary") {
      setSalaryRange([Number.parseInt(value), salaryRange[1]])
    } else {
      setSalaryRange([salaryRange[0], Number.parseInt(value)])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()

    // Create query parameters for filtering
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (locationFilter) params.append("location", locationFilter)
    if (categoryFilter) params.append("category", categoryFilter)
    if (companyFilter) params.append("company", companyFilter) // Add company filter to params
    params.append("minSalary", salaryRange[0])
    params.append("maxSalary", salaryRange[1])

    // Navigate to results page with filters
    navigate(`/jobs?${params.toString()}`)
  }

  const formatSalary = (salary) => {
    if (salary >= 10000000) return "1 Cr+"
    if (salary >= 100000) return `${(salary / 100000).toFixed(1)} Lakh`
    return `₹${salary.toLocaleString()}`
  }

  return (
    <main className="container py-4">
      <div className="job-header text-center mb-5">
        <h1 className="display-4 fw-bold">Find Your Dream Job</h1>
        <p className="lead text-muted">Discover opportunities that match your skills and career goals</p>
      </div>

      {/* Search and Filters */}
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
                    placeholder="Search jobs, skills, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <select
                  className="form-select form-select-lg"
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
              <div className="col-md-3">
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
            </div>

            {/* Add company filter row */}
            <div className="row mb-4">
              <div className="col-md-6">
                <select
                  className="form-select form-select-lg"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option value="">All Companies</option>
                  {allCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-md-3 mb-3 mb-md-0">
                <label className="form-label fw-bold">Salary Range</label>
                <div className="d-flex justify-content-between">
                  <span className="salary-display">{formatSalary(salaryRange[0])}</span>
                  <span className="salary-display">to</span>
                  <span className="salary-display">{formatSalary(salaryRange[1])}</span>
                </div>
              </div>
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="row">
                  <div className="col-6">
                    <label htmlFor="minSalary" className="form-label small">
                      Min Salary
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      id="minSalary"
                      name="minSalary"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={salaryRange[0]}
                      onChange={handleSalaryRangeChange}
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="maxSalary" className="form-label small">
                      Max Salary
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      id="maxSalary"
                      name="maxSalary"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={salaryRange[1]}
                      onChange={handleSalaryRangeChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-md-end">
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  <i className="bi bi-search me-2"></i>
                  Search Jobs
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Job Categories */}
      <JobCategories categories={categories} loading={loading} />

      {/* Top Companies */}
      <TopCompanies industries={companies} loading={loading} />
    </main>
  )
}

export default Layout
