import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { storeContext } from "../../Contexts/StoreContext";
import axios from "axios";
import Cross from "../../Assets/cross_icon.png"
import { useEffect } from "react";

function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login");
  const [userType, setUserType] = useState("Student"); // Default userType
  const { url, setToken } = useContext(storeContext);

  // Initial data structure
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    skills: [],
    education: [],
    projects: [],
    companyName: "",
    location: "",
    description: "",
    website: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url + `/api/${userType.toLowerCase()}/${currState === "Login" ? "login" : "register"}`;
    
    const response = await axios.post(newUrl, data);
    
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  };
  // Function to close the popup and restore scrolling
  const closePopup = () => {
    setShowLogin(false);
    document.body.style.overflow = "auto"; // Allow scrolling again
  };

  // Prevent background scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling when popup opens

    return () => {
      document.body.style.overflow = "auto"; // Enable scrolling when popup closes
    };
  }, [])

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-pop-title">
        <h2 className="State">{currState}</h2>
          <img  src={Cross} onClick={() => setShowLogin(false)} alt="Close" />
        </div>

        {/* User Type Selection */}
        <div className="user-type-selection">
          <label>
            <input type="radio" name="userType" value="Student" checked={userType === "Student"} onChange={() => setUserType("Student")} />
            Student
          </label>
          <label>
            <input type="radio" name="userType" value="Company" checked={userType === "Company"} onChange={() => setUserType("Company")} />
            Company
          </label>
          <label>
            <input type="radio" name="userType" value="Admin" checked={userType === "Admin"} onChange={() => setUserType("Admin")} />
            Admin
          </label>
        </div>

        {/* Common Fields */}
        <div className="login-popup-inputs">
          {currState === "Sign Up" && userType === "Student" && (
            <input type="text" name="username" placeholder="Username" value={data.username} onChange={onChangeHandler} required />
          )}
          {currState === "Sign Up" && userType === "Company" && (
            <input type="text" name="companyName" placeholder="Company Name" value={data.companyName} onChange={onChangeHandler} required />
          )}
          <input type="email" name="email" placeholder="Email" value={data.email} onChange={onChangeHandler} required />
          <input type="password" name="password" placeholder="Password" value={data.password} onChange={onChangeHandler} required />

          {/* Additional Fields for Sign Up */}
          {currState === "Sign Up" && userType === "Student" && (
            <>
              <input type="text" name="skills" placeholder="Skills (comma-separated)" onChange={(e) => setData({ ...data, skills: e.target.value.split(",") })} />
              <input type="text" name="education" placeholder="Education (comma-separated)" onChange={(e) => setData({ ...data, education: e.target.value.split(",") })} />
              <input type="text" name="projects" placeholder="Projects (comma-separated)" onChange={(e) => setData({ ...data, projects: e.target.value.split(",") })} />
            </>
          )}
          {currState === "Sign Up" && userType === "Company" && (
            <>
              <input type="text" name="location" placeholder="Company Location" value={data.location} onChange={onChangeHandler} required />
              <input type="text" name="description" placeholder="Company Description" value={data.description} onChange={onChangeHandler} required />
              <input type="text" name="website" placeholder="Company Website" value={data.website} onChange={onChangeHandler} required />
            </>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit">{currState === "Sign Up" ? "Create Account" : "Login"}</button>

        {/* Terms and Conditions */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & policy</p>
        </div>

        {/* Toggle between Login & Sign Up */}
        {currState === "Login" ? (
          <p className="last">
            Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p className="last">
            Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
