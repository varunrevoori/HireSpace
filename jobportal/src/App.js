import Home from "./Pages/Home/Home";
import Footer from "./Components/Footer/Footer"
import Navbar from "./Components/Navbar/Navbar"
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPopup from "./Pages/LoginPopup/LoginPopup";
import Layout from "./Pages/JobInternship/Layout/Layout"

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup  setShowLogin={setShowLogin}/> : <></>}
      <div className="app">
        <Navbar  setShowLogin={setShowLogin}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobspage" element={<Layout/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
