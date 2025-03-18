
"use client"

import React from 'react'
import JobCategories from '../JobCategory/JobCategory'
import TopCompanies from '../JobCompanies/JobCompanies'
import JobCard from '../JobListing/JobListing'
import { useState, useEffect } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Layout.css"
export default function Layout() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [companies, setCompanies] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [salaryRange, setSalaryRange] = useState([0, 10000000])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch jobs from API
    const fetchJobs = async () => {
      try {
        // Your actual API endpoint
        const response = await fetch("http://localhost:5001/apis/job/joblisting")
        const data = await response.json()
        setJobs(data)
        setFilteredJobs(data)

        // Extract unique locations from the data
        const uniqueLocations = [...new Set(data.map((job) => job.location))]
        setLocations(uniqueLocations)

        // Extract unique categories from the data
        const uniqueCategories = [...new Set(data.map((job) => job.category))]
        const categoriesWithCount = uniqueCategories.map((category) => {
          const count = data.filter((job) => job.category === category).length
          return { name: category, count }
        })
        setCategories(categoriesWithCount)

        // Extract unique companies from the data
        const uniqueCompanies = [...new Set(data.map((job) => job.company))]
        const companiesData = uniqueCompanies.map((company) => {
          const companyJobs = data.filter((job) => job.company === company)
          const logo = companyJobs[0]?.companyLogo || "/placeholder.svg"
          return { name: company, logo }
        })
        // Group companies by industry (using category as a proxy for industry)
        const industries = [...new Set(data.map((job) => job.category))]
        const industriesWithCompanies = industries.map((industry) => {
          const industryJobs = data.filter((job) => job.category === industry)
          const industryCompanies = [...new Set(industryJobs.map((job) => job.company))].map((company) => {
            const companyData = companiesData.find((c) => c.name === company)
            return companyData
          })
          return {
            name: industry,
            companies: industryCompanies.slice(0, 3), // Limit to 3 companies per industry
          }
        })
      console.log("industries",industries)

        setCompanies(industriesWithCompanies)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    // Filter jobs based on search term and filters
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLocation = locationFilter ? job.location === locationFilter : true

      const matchesCategory = categoryFilter ? job.category === categoryFilter : true

      // Check if job salary range overlaps with filter range
      const jobMinSalary = job.salaryRange[0]
      const jobMaxSalary = job.salaryRange[1]
      const matchesSalary = jobMinSalary <= salaryRange[1] && jobMaxSalary >= salaryRange[0]

      return matchesSearch && matchesLocation && matchesCategory && matchesSalary
    })

    setFilteredJobs(filtered)
  }, [searchTerm, locationFilter, categoryFilter, salaryRange, jobs])

  const handleSalaryRangeChange = (event) => {
    const { name, value } = event.target
    if (name === "minSalary") {
      setSalaryRange([Number.parseInt(value), salaryRange[1]])
    } else {
      setSalaryRange([salaryRange[0], Number.parseInt(value)])
    }
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setLocationFilter("")
    setCategoryFilter("")
    setSalaryRange([0, 10000000])
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
              <button className="btn btn-outline-primary btn-lg w-100" onClick={handleResetFilters}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Categories */}
      <JobCategories categories={categories} loading={loading} />

      {/* Top Companies */}
      <TopCompanies industries={companies} loading={loading} />

      {/* Job Listings */}
      <section className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
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
              <div key={job.jobId} className="col-md-6 col-lg-4 mb-4">
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
      </section>
    </main>
  )
}

