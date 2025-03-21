    "use client"

import { useNavigate } from "react-router-dom"
import "./MockTestCard.css"

function MockTestCard({ test }) {
  const navigate = useNavigate()

  const handleTakeTestClick = () => {
    navigate(`/mocktests/take/${test.mockTestId}`)
  }

  return (
    <div className="card mocktest-card h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-3">
          <div className="test-image me-3">
            <img
              src={test.image || "/placeholder.svg"}
              alt={test.name}
              width={48}
              height={48}
              className="img-fluid"
            />
          </div>
          <div>
            <h5 className="card-title mb-0">{test.name}</h5>
            <p className="domain-name mb-0">{test.domain}</p>
          </div>
          <div className="ms-auto">
            <span className={`badge difficulty-${test.difficulty.toLowerCase()}`}>
              {test.difficulty}
            </span>
          </div>
        </div>

        <div className="test-details mb-3">
          <div className="test-detail">
            <i className="bi bi-list-ol"></i>
            <span>{test.totalQuestions} Questions</span>
          </div>
          <div className="test-detail">
            <i className="bi bi-clock"></i>
            <span>{test.timeLimit} mins</span>
          </div>
          <div className="test-detail">
            <i className="bi bi-star-fill"></i>
            <span>{test.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="category-container mb-3">
          <span className="category-badge">{test.category}</span>
        </div>
      </div>
      <div className="card-footer bg-white border-top-0 pt-0">
        <button className="btn btn-primary w-100" onClick={handleTakeTestClick}>
          <i className="bi bi-play-circle me-2"></i>
          Take Test
        </button>
      </div>
    </div>
  )
}

export default MockTestCard