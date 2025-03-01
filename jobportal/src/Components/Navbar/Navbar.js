import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../Assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState("Home");

  return (
    <nav className="navbar">
      <img className="nav-logo" src={logo} alt="Logo" />
      <button className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul className={isOpen ? "nav-links open" : "nav-links"}>
        <li>
          <a
            href="#Home"
            onClick={() => {
              setMenu("Home");
              setIsOpen(false); // Close menu on click
            }}
            className={menu === "Home" ? "active" : ""}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#About"
            onClick={() => {
              setMenu("About");
              setIsOpen(false);
            }}
            className={menu === "About" ? "active" : ""}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#services"
            onClick={() => {
              setMenu("services");
              setIsOpen(false);
            }}
            className={menu === "services" ? "active" : ""}
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#contact"
            onClick={() => {
              setMenu("contact");
              setIsOpen(false);
            }}
            className={menu === "contact" ? "active" : ""}
          >
            Contact
          </a>
        </li>
        <li>
          <button className="login-btn">Login</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
