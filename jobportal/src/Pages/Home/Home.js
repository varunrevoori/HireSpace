import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import Descriptions from '../../Components/Description/Descriptions'
import Features from '../../Components/Features/Features'
import CompanyDesc from '../../Components/Company/CompanydDesc'
import "./Home.css"

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="content">
        <Descriptions />
        <Features />
        <CompanyDesc/>
      </div>
      <Footer />
    </div>
  )
}

export default Home
