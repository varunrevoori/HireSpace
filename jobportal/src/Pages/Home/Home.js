import React from 'react'
import Descriptions from '../../Components/Description/Descriptions'
import Features from '../../Components/Features/Features'
import CompanyDesc from '../../Components/Company/CompanydDesc'
import "./Home.css"

function Home() {
  return (
    <div className="home-container">
        <Descriptions />
        <Features />
        <CompanyDesc/>
    </div>  
  )
}

export default Home
