import "./Navbar.css";
import logo from "../../Assets/logo.png";
import profileIcon from "../../Assets/user.png";
import { useNavigate } from "react-router-dom";
import { storeContext } from "../../Contexts/StoreContext";
import React, { useState, useEffect, useContext, useRef } from "react";

function Navbar({ setShowLogin }) {
  const { token, setToken } = useContext(storeContext);
  const [menu, setMenu] = useState("Home");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setShowDropdown(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <img className="nav-logo" onClick={() => navigate("/")} src={logo} alt="Logo" />
      <ul className="nav-links">
        <li>
          <a href="#Home" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</a>
        </li>
        <li>
          <a href="#About" onClick={() => setMenu("About")} className={menu === "About" ? "active" : ""}>About</a>
        </li>
        <li>
          <a href="#Services" onClick={() => setMenu("Services")} className={menu === "Services" ? "active" : ""}>Services</a>
        </li>
        <li>
          <a href="#Contact" onClick={() => setMenu("Contact")} className={menu === "Contact" ? "active" : ""}>Contact</a>
        </li>
      </ul>

      {/* Profile Icon and Dropdown */}
      {token ? (
        <div className="profile-menu" ref={dropdownRef}>
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={() => setShowDropdown((prev) => !prev)}
          />
          {showDropdown && (
            <div className="dropdown-menu">
              <ul>
                <li onClick={() => navigate("/dashboard")}>View Dashboard</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
      )}
    </nav>
  );
}

export default Navbar;
