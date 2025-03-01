import React, {  useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { storeContext } from "../../Contexts/StoreContext";
import axios from "axios"


const LoginPopup({ setShowLogin }){
  const [currState, setCurrState] = useState("Login");
  const {url,setToken}=useContext(storeContext)

  const [data,setData]=useState({
    name:"",
    email:"",
    password:""
  })

const onChangeHandlier=(event)=>{
  const name=event.target.name;
  const value=event.target.value;
  setData(data=>({...data,[name]:value}))
}

const onLogin=async(event)=>{
  event.preventDefault();
  let newUrl = url + (currState === "Login" ? "/api/student/login" : "/api/student/register");
const response=await axios.post(newUrl,data)
if(response.data.success){
  setToken(response.data.token)
  localStorage.setItem("token",response.data.token)
  setShowLogin(false)
}else{
  alert(response.data.message)
}

}

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={onLogin}>
        <div className="login-pop-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              onChange={onChangeHandlier}
              value={data.name}
              placeholder="Your name"
              required
            />
          )}
          <input type="email" name="email" onChange={onChangeHandlier} value={data.email} placeholder="Your email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChangeHandlier} value={data.password} 
            required
          />
        </div>
        <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & policy</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
