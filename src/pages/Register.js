import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      {/* EMBEDDED STYLES - Blue Theme */}
      <style>{`
          .auth-container {
              min-height: 80vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #050509;
              padding: 20px;
              color: white;
          }
          .auth-card {
              background-color: #151621;
              padding: 40px;
              border-radius: 16px;
              width: 100%;
              max-width: 400px;
              border: 1px solid #2a2b3d;
              text-align: center;
              box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          }
          .auth-title { margin-bottom: 10px; font-weight: 800; font-size: 2rem; }
          .auth-subtitle { color: #8b8d9d; margin-bottom: 30px; font-size: 0.95rem; }
          
          .auth-form { display: flex; flex-direction: column; gap: 15px; }
          
          .auth-input {
              width: 100%;
              padding: 14px;
              border-radius: 10px;
              border: 1px solid #2a2b3d;
              background-color: #0b0c15;
              color: white;
              font-size: 1rem;
              outline: none;
              box-sizing: border-box; 
              transition: border-color 0.2s;
          }
          /* Blue Focus Glow */
          .auth-input:focus { border-color: #2970ff; } 

          .auth-button {
              padding: 14px;
              border-radius: 10px;
              border: none;
              background-color: #2970ff; /* Blue */
              color: white; /* White Text */
              font-size: 1.1rem;
              font-weight: bold;
              cursor: pointer;
              margin-top: 10px;
              transition: transform 0.1s;
          }
          .auth-button:active { transform: scale(0.98); }

          .auth-footer { margin-top: 25px; color: #888; fontSize: 0.9rem; }
          .auth-footer a { color: #2970ff; text-decoration: none; font-weight: bold; }

          /* --- MOBILE RESPONSIVENESS --- */
          @media (max-width: 768px) {
              .auth-card {
                  padding: 30px 20px;
                  max-width: 100%;
              }
              .auth-input {
                  font-size: 16px; 
              }
          }
      `}</style>

      <div className="auth-card">
        <h2 className="auth-title">Join PULSE</h2>
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
          
          <div className="phone-input-group" style={{textAlign:'left'}}>
            <input
              type="text"
              className="auth-input"
              placeholder="Phone (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <small style={{ color: "#666", fontSize: "0.75rem", display: "block", marginTop: "5px", paddingLeft: "5px" }}>
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