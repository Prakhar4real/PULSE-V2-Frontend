import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import api from '../services/api';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                
                const token = localStorage.getItem('access');
                if (token) {
                    const res = await api.get('user/profile/');
                    setUser(res.data);
                }
            } catch (error) {
                console.log("Not logged in");
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.logo} onClick={() => navigate('/')}>
                <span style={styles.dot}>●</span> PULSE
            </div>

            <div style={styles.links}>
                {user ? (
                    <>
                        
                        <button onClick={() => navigate('/notices')} style={styles.linkBtn}>Community</button>
                        
                        <button onClick={() => navigate('/missions')} style={styles.linkBtn}>Missions</button>
                        
                        <div style={styles.badge}>
                            🏆 {user.username} | {user.points} XP
                        </div>
                        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Log In</Link>
                        <button onClick={() => navigate('/register')} style={styles.signupBtn}>Sign Up</button>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#000', borderBottom: '1px solid #222' },
    logo: { fontSize: '1.5rem', fontWeight: 'bold', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    dot: { color: '#007bff', fontSize: '1.2rem' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: '#ccc', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' },
    linkBtn: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }, // Added fontWeight for better look
    signupBtn: { padding: '8px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    badge: { padding: '8px 15px', backgroundColor: '#1e1e1e', borderRadius: '20px', border: '1px solid #333', color: '#FFD700', fontWeight: 'bold' },
    logoutBtn: { padding: '8px 15px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Navbar;