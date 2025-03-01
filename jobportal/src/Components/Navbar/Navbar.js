import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../Assets/logo.png";
import { useNavigate } from "react-router-dom"; 


function Navbar ({setShowLogin}) {
  const [menu, setMenu] = useState("Home");
  const navigate = useNavigate();



  return (
    <nav className="navbar">
      <img className="nav-logo" onClick={() => navigate("/")}  src={logo} alt="Logo" />
      <ul className="nav-links">
        <li>
          <a
            href="#Home"
            onClick={() => setMenu("Home")}
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#About"
            onClick={() => setMenu("About")}
            className={menu === "About" ? "active" : ""}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#Services"
            onClick={() => setMenu("services")}
            className={menu === "services" ? "active" : ""}
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#Contact"
            onClick={() => setMenu("contact")}
            className={menu === "contact" ? "active" : ""}
          >
            Contact
          </a>
        </li>
      </ul>
      <button className="login-btn" onClick={()=>setShowLogin(true)}>Login</button>
    </nav>
  );
};

export default Navbar;
