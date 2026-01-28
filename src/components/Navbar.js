import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import '../styles/Navbar.css'; 

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access');
    
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        window.location.href = '/'; 
    };

    return (
        <nav className="navbar">
            <div 
                className="navbar-logo" 
                onClick={() => navigate(token ? '/dashboard' : '/')} 
                style={{cursor:'pointer'}}
            >
                PULSE<span style={{color:'#2970ff'}}>.</span>
            </div>
            
            <div className="navbar-links">
                {token ? (
                    /* --- LOGGED IN USER --- */
                    <>
                        <Link to="/community">Live Map</Link>
                        <Link to="/missions">Missions</Link>
                        
                        
                        <Link to="/notices">Community</Link>
                        
                        <button onClick={handleLogout} className="logout-btn">
                            <FiLogOut /> Logout
                        </button>
                    </>
                ) : (
                    /* --- GUEST VISITOR --- */
                    <>
                        <Link to="/community" style={{textDecoration:'none', color:'#ccc', marginRight:'20px'}}>Live Map</Link>
                        <Link to="/login" className="nav-btn-login">Login</Link>
                        <Link to="/register" className="nav-btn-primary">Join Now</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;