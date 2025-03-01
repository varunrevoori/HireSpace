import React, { useRef } from "react";
import "./CompanyDesc.css";

const companies = [
    {
      id: 1,
      name: "Google",
      rating: 4.8,
      reviews: "12.5K reviews",
      description: "A global leader in technology and innovation.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      id: 2,
      name: "Microsoft",
      rating: 4.7,
      reviews: "9.3K reviews",
      description: "Empowering businesses with cloud and software solutions.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      id: 3,
      name: "Amazon",
      rating: 4.6,
      reviews: "11K reviews",
      description: "A leader in e-commerce, AI, and cloud computing.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      id: 4,
      name: "Facebook",
      rating: 4.5,
      reviews: "8K reviews",
      description: "Connecting the world through social media platforms.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
    },
    {
      id: 5,
      name: "Datamatics",
      rating: 3.5,
      reviews: "2K+ reviews",
      description: "Global digital solutions & technology company.",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Datamatics_logo.svg/2560px-Datamatics_logo.svg.png",
    },
    {
      id: 6,
      name: "Firstsource",
      rating: 3.7,
      reviews: "4.5K+ reviews",
      description: "Leading provider of transformational solutions.",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Firstsource_Solutions_Logo.svg/2560px-Firstsource_Solutions_Logo.svg.png",
    },
    {
      id: 7,
      name: "Genpact",
      rating: 3.8,
      reviews: "31.4K+ reviews",
      description: "Global professional services firm.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Genpact_logo.svg/2560px-Genpact_logo.svg.png",
    },
    {
      id: 8,
      name: "Reliance Industries (RIL)",
      rating: 4.0,
      reviews: "16K+ reviews",
      description: "Indian multinational conglomerate company.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Reliance_Industries_Logo.png",
    },
    {
      id: 9,
      name: "Hitachi",
      rating: 4.1,
      reviews: "8K+ reviews",
      description: "Advancing energy for sustainable future.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Hitachi_logo.svg/2560px-Hitachi_logo.svg.png",
    },
    {
      id: 10,
      name: "Tata Consultancy Services",
      rating: 4.2,
      reviews: "45K+ reviews",
      description: "Global leader in IT services and consulting.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Tata_Consultancy_Services_Logo.svg/2560px-Tata_Consultancy_Services_Logo.svg.png",
    },
  ];

const CompanyDesc = () => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth / 2, behavior: "smooth" });
    }
  };

  return (
    <div className="container" id="Services">
      <h1>Top Companies Hiring</h1>
      <div className="carousel-container">
        <button className="nav-btn prev-btn" onClick={scrollLeft}>
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="carousel" ref={carouselRef}>
          {companies.map((company) => (
            <div key={company.id} className="company-card">
              <div className="logo-container">
                <img src={company.logo} alt={company.name} className="logo-img" />
              </div>
              <h2>{company.name}</h2>
              <div className="rating">
                <span className="stars">⭐</span>
                <span className="rating-value">{company.rating}</span>
                <span className="reviews">({company.reviews})</span>
              </div>
              <p className="description">{company.description}</p>
              
            </div>
          ))}
        </div>

        <button className="nav-btn next-btn" onClick={scrollRight}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
export default CompanyDesc