import React from 'react'
import { FaLaptopCode, FaBook, FaVideo, FaBriefcase, FaFileAlt } from "react-icons/fa";

const features = [
  { title: "Hackathons", description: "Participate in coding challenges and competitions.", icon: <FaLaptopCode /> },
  { title: "Mock Tests", description: "Test your skills with real exam-like practice.", icon: <FaBook /> },
  { title: "Virtual Interview Prep", description: "Ace your interviews with mock interview sessions.", icon: <FaVideo /> },
  { title: "Job Listing", description: "Find the latest job openings and apply instantly.", icon: <FaBriefcase /> },
  { title: "Resume Analyser", description: "Get AI-powered feedback on your resume.", icon: <FaFileAlt /> }
];

function Features() {
  return (

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {features.map((feature, index) => (
        <div key={index} className="bg-white shadow-md p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition">
          <div className="text-4xl text-blue-500 mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Learn More
          </button>
        </div>
      ))}
    </div>
  );
};



export default Features