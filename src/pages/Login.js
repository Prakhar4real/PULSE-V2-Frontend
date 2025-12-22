import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Send Login Request
            const res = await api.post('token/', formData);
            
            // 2. Save the Tokens (Key name must match api.js!)
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            
            // 3. FORCE REFRESH & NAVIGATE
            window.location.href = '/dashboard'; 

        } catch (error) {
            console.error("Login Error", error);
            alert("Invalid Credentials. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Welcome Back</h2>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.group}>
                        <label>Username</label>
                        <input name="username" type="text" placeholder="Username" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.group}>
                        <label>Password</label>
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
                    </div>

                    <button type="submit" style={styles.btn}>Log In</button>
                </form>

                <p style={{marginTop: '20px', textAlign: 'center', color: '#888'}}>
                    New to PULSE? <Link to="/register" style={{color: '#007bff'}}>Create an Account</Link>
                </p>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: { minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' },
    card: { backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '15px', width: '100%', maxWidth: '400px', border: '1px solid #333' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    group: { display: 'flex', flexDirection: 'column', gap: '5px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2d2d2d', color: 'white', fontSize: '1rem' },
    btn: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default Login;