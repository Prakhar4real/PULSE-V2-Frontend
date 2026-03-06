import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false); //NEW STATE

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); //TURN ON LOADER
        try {
            const res = await api.post('token/', formData);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Login Error", error);
            alert("Invalid Credentials. Please try again.");
        } finally {
            setIsLoading(false); //TURN OFF LOADER
        }
    };

    return (
        <div className="login-container">
            {/* EMBEDDED STYLES FOR MOBILE & DESKTOP */}
            <style>{`
                .login-container {
                    min-height: 80vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    padding: 20px;
                    background-color: #050509; /* Matches global theme */
                }
                .login-card {
                    background-color: #151621;
                    padding: 40px;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid #2a2b3d;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .login-input {
                    padding: 14px;
                    border-radius: 10px;
                    border: 1px solid #2a2b3d;
                    background-color: #0b0c15;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .login-input:focus {
                    border-color: #2970ff;
                }
                .login-btn {
                    padding: 14px;
                    border-radius: 10px;
                    border: none;
                    background-color: #2970ff;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    width: 100%;
                    transition: transform 0.1s;
                }
                .login-btn:active {
                    transform: scale(0.98);
                }

                /* --- MOBILE RESPONSIVENESS --- */
                @media (max-width: 768px) {
                    .login-card {
                        padding: 30px 20px; /* Smaller padding */
                        max-width: 100%; /* Full width */
                    }
                    .login-title {
                        font-size: 1.8rem;
                    }
                }
            `}</style>

            <div className="login-card">
                <h2 className="login-title" style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800' }}>Welcome Back</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ color: '#8b8d9d', fontSize: '0.9rem' }}>Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            onChange={handleChange}
                            className="login-input"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ color: '#8b8d9d', fontSize: '0.9rem' }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            onChange={handleChange}
                            className="login-input"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/*SMART BUTTON */}
                    {isLoading ? (
                        <button type="button" className="login-btn" style={{ opacity: 0.7, cursor: 'not-allowed' }} disabled>
                            <span className="pulse-loader"></span> Logging In...
                        </button>
                    ) : (
                        <button type="submit" className="login-btn">Log In</button>
                    )}
                </form>

                <p style={{ marginTop: '25px', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                    New to PULSE? <Link to="/register" style={{ color: '#2970ff', fontWeight: 'bold', textDecoration: 'none' }}>Create an Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;