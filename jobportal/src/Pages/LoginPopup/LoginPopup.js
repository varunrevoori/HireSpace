import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { storeContext } from "../../Contexts/StoreContext";
import axios from "axios";
import Cross from "../../Assets/cross_icon.png"
import { useEffect } from "react";

function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("login");
  const [userType, setUserType] = useState("student"); // Default userType
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
    let newUrl = `${url}/apis/${userType.toLowerCase()}/${currState}`;

    // Ensure required fields are present
    const requestData = { ...data, userType };

    if (currState === "register") {
        if (userType === "student" && (!data.username || !data.email || !data.password)) {
            alert("Please fill in all required fields for registration.");
            return;
        }
        if (userType === "company" && (!data.companyName || !data.email || !data.password)) {
            alert("Please fill in all required fields for company registration.");
            return;
        }
        if (userType === "admin" && (!data.email || !data.password)) {
          alert("Please fill in all required fields for admin registration.");
          return;
      }
    }

    try {
        const response = await axios.post(newUrl, requestData);

        if (response.status === 200 || response.status === 201) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
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
            <input type="radio" name="userType" value="student" checked={userType === "student"} onChange={() => setUserType("student")} />
            Student
          </label>
          <label>
            <input type="radio" name="userType" value="company" checked={userType === "company"} onChange={() => setUserType("company")} />
            Company
          </label>
          <label>
            <input type="radio" name="userType" value="admin" checked={userType === "admin"} onChange={() => setUserType("admin")} />
            Admin
          </label>
        </div>

        {/* Common Fields */}
        <div className="login-popup-inputs">
          {currState === "register" && userType === "student" && (
            <input type="text" name="username" placeholder="Username" value={data.username} onChange={onChangeHandler} required />
          )}
          {currState === "register" && userType === "company" && (
            <input type="text" name="companyName" placeholder="Company Name" value={data.companyName} onChange={onChangeHandler} required />
          )}
          <input type="email" name="email" placeholder="Email" value={data.email} onChange={onChangeHandler} required />
          <input type="password" name="password" placeholder="Password" value={data.password} onChange={onChangeHandler} required />

          {/* Additional Fields for Sign Up */}
          {currState === "register" && userType === "student" && (
            <>
              <input type="text" name="skills" placeholder="Skills (comma-separated)" onChange={(e) => setData({ ...data, skills: e.target.value.split(",") })} />
              <input type="text" name="education" placeholder="Education (comma-separated)" onChange={(e) => setData({ ...data, education: e.target.value.split(",") })} />
              <input type="text" name="projects" placeholder="Projects (comma-separated)" onChange={(e) => setData({ ...data, projects: e.target.value.split(",") })} />
            </>
          )}
          {currState === "register" && userType === "company" && (
            <>
              <input type="text" name="location" placeholder="Company Location" value={data.location} onChange={onChangeHandler} required />
              <input type="text" name="description" placeholder="Company Description" value={data.description} onChange={onChangeHandler} required />
              <input type="text" name="website" placeholder="Company Website" value={data.website} onChange={onChangeHandler} required />
            </>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit">{currState === "register" ? "Create Account" : "login"}</button>

        {/* Terms and Conditions */}
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & policy</p>
        </div>

        {/* Toggle between Login & Sign Up */}
        {currState === "login" ? (
          <p className="last">
            Create a new account? <span onClick={() => setCurrState("register")}>Click here</span>
          </p>
        ) : (
          <p className="last">
            Already have an account? <span onClick={() => setCurrState("login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
