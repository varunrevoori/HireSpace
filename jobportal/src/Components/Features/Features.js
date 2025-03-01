import React, { useState } from "react";
import "./Features.css";
import Hackathon from "../../Assets/Hackathon.jpg"
import MockTest from "../../Assets/MockTest.jpg"
import Resume from "../../Assets/Resume.jpg"
import Interview from "../../Assets/Interview.jpg"
import Job from "../../Assets/Job.jpg"

// SVG Icons as components
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <line x1="10" y1="9" x2="8" y2="9"></line>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <path d="m9 11 3 3L22 4"></path>
  </svg>
);

function Features (){
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <CodeIcon />,
      title: "Hackathons",
      description:
        "Participate in our regular hackathons to build real-world projects, collaborate with peers, and showcase your skills to potential employers.",
      image: Hackathon,
      colorClass: "violet",
      benefits: [
        "Build portfolio-worthy projects",
        "Network with industry professionals",
        "Win prizes and recognition",
        "Learn new technologies hands-on",
      ],
    },
    {
      icon: <FileTextIcon />,
      title: "Mock Tests",
      description:
        "Practice with industry-standard assessments designed to simulate real technical interviews and coding challenges from top companies.",
      image: MockTest,
      colorClass: "blue",
      benefits: [
        "Practice with real interview questions",
        "Get detailed performance analytics",
        "Improve your problem-solving skills",
        "Prepare for specific company interviews",
      ],
    },
    {
      icon: <UsersIcon />,
      title: "Interview Preparation",
      description:
        "Get comprehensive preparation for technical and behavioral interviews with personalized feedback, mock interviews, and expert tips.",
      image: Interview,
      colorClass: "emerald",
      benefits: [
        "One-on-one mock interviews",
        "Personalized feedback from experts",
        "Behavioral interview training",
        "System design interview practice",
      ],
    },
    {
      icon: <BriefcaseIcon />,
      title: "Jobs & Internships",
      description:
        "Access exclusive job and internship opportunities from our partner companies, with personalized recommendations based on your profile.",
      image: Job,
      colorClass: "amber",
      benefits: [
        "Exclusive job listings from partners",
        "Resume and portfolio reviews",
        "Direct referrals to hiring managers",
        "Career path guidance and mentorship",
      ],
    },
    {
      icon: <BarChartIcon />,
      title: "Resume Analysis",
      description:
        "Get your resume analyzed by our AI-powered tool to receive an ATS (Applicant Tracking System) score and tailored improvement suggestions.",
      image: Resume,
      colorClass: "indigo",
      benefits: [
        "ATS compatibility score",
        "Keyword optimization suggestions",
        "Format and structure analysis",
        "Industry-specific recommendations",
      ],
    },
  ];

  return (
    <section className="features-section" id="About">
      <div className="container">
        <div className="section-header">
          <h2>Your Complete Career Toolkit</h2>
          <p>
            Everything you need to launch and grow your career in technology
          </p>
        </div>

        {/* Feature cards that act as tabs */}
        <div className="feature-cards">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`feature-card ${activeFeature === index ? `active ${feature.colorClass}` : ""}`}
            >
              <div className={`feature-card-header ${feature.colorClass}`}>
                {React.cloneElement(feature.icon, {
                  className: `feature-icon ${activeFeature === index ? "pulse" : ""}`,
                })}
                <h3>{feature.title}</h3>
              </div>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature detail section */}
        <div className="feature-detail">
          <div className="feature-detail-grid">
            {/* Feature image */}
            <div className="feature-image-container">
              <img
                src={features[activeFeature].image || "/placeholder.svg"}
                alt={features[activeFeature].title}
                className="feature-image"
              />
              <div className="feature-image-overlay">
                <div className="feature-image-text">
                  <h3>{features[activeFeature].title}</h3>
                </div>
              </div>
            </div>

            {/* Feature details */}
            <div className="feature-content">
              <div className={`feature-title ${features[activeFeature].colorClass}`}>
                {React.cloneElement(features[activeFeature].icon, { className: "feature-icon-small" })}
                <span>{features[activeFeature].title}</span>
              </div>

              <h3 className="feature-heading">How it helps you</h3>
              <p className="feature-paragraph">{features[activeFeature].description}</p>

              <div className="benefits-container">
                <h4 className="benefits-heading">Key Benefits:</h4>
                <ul className="benefits-list">
                  {features[activeFeature].benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item">
                      <CheckCircleIcon className={`check-icon ${features[activeFeature].colorClass}`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`explore-button ${features[activeFeature].colorClass}`}>
                Explore {features[activeFeature].title}
                <ArrowRightIcon className="arrow-icon pulse" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
