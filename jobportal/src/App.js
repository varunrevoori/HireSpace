import Home from "./Pages/Home/Home";
import Footer from "./Components/Footer/Footer"
import Navbar from "./Components/Navbar/Navbar"
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPopup from "./Pages/LoginPopup/LoginPopup";
import Layout from "./Pages/JobInternship/Layout/Layout"
import JobListing from "./Pages/JobInternship/JobListing/JobListing";
import JobApplication from "./Pages/JobInternship/JobApplication/JobApplication";
import MockTestLayout from "./Pages/MockTest/MockTestsLayout/MockTestsLayout";
import MockTestListing from "./Pages/MockTest/MockTestsListing/MockTestsListing";
import MockTestTake from "./Pages/MockTest/MockTestTake/MockTestTake";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);



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
          <Route
            path="/mocktests/take/:mockTestId"
            element={
              <MockTestTake
                setShowLogin={setShowLogin}
                isLoggedIn={isLoggedIn}
                user={user}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;