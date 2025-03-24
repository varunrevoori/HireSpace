import Home from "./Pages/Home/Home";
import Footer from "./Components/Footer/Footer"
import Navbar from "./Components/Navbar/Navbar"
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPopup from "./Pages/LoginPopup/LoginPopup";
import Layout from "./Pages/JobInternship/Layout/Layout"
import JobListing from "./Pages/JobInternship/JobListing/JobListing";
import JobApplication from "./Pages/JobInternship/JobApplication/JobApplication";
import MockTestLayout from "./Pages/MockTest/MockTestsLayout/MockTestsLayout";
import MockTestListing from "./Pages/MockTest/MockTestsListing/MockTestsListing";
import MockTestTake from "./Pages/MockTest/MockTestTake/MockTestTake";
import Dashboard from "./Pages/Dashboard/DashBoard";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in (e.g., check localStorage for token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      {showLogin ? (
        <LoginPopup
          setShowLogin={setShowLogin}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
        />
      ) : (
        <></>
      )}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} isLoggedIn={isLoggedIn} user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobspage" element={<Layout />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/apply/:jobId" element={<JobApplication />} />
          <Route path="/mocktestspage" element={<MockTestLayout />} />
          <Route path="/mocktests" element={<MockTestListing />} />
          
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;