import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css"; 

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send phone_number only if user typed it
      const payload = { 
          username, 
          password, 
          phone_number: phone.trim() === "" ? null : phone 
      };

      await api.post("user/register/", payload);
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join PULSE</h2>
        <p className="auth-subtitle">Become a verified citizen.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            className="auth-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          {/* OPTIONAL PHONE INPUT - FIXED SPACING */}
          <div className="phone-input-group">
            <input
              type="text"
              className="auth-input"
              placeholder="Phone (Optional - for SMS Alerts)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              
              style={{ marginBottom: "5px" }} 
            />
            
            <small style={{ color: "#ccc", fontSize: "0.7rem", display: "block", marginTop: "2px", marginBottom: "15px", textAlign: "left", paddingLeft: "5px" }}>
              *SMS alerts active for Verified Testers only.
            </small>
          </div>

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="auth-button">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;