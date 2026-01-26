import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; 

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            // 1. Get the token from storage
            const token = localStorage.getItem("access_token");
            
            try {
                // 2. Send the token in the headers 
                const res = await axios.get("http://127.0.0.1:8000/api/leaderboard/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log("Leaderboard Data:", res.data); 
                setLeaders(res.data);
            } catch (error) {
                console.error("Error loading leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    // Helper to get medal emoji based on rank
    const getRankIcon = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    return (
        <div style={styles.container}>
            
            {/* Header with Back Button */}
            <div style={styles.header}>
                <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
                    ← Back to Command Center
                </button>
                <h1 style={styles.title}>City Guardians Leaderboard</h1>
                <p style={styles.subtitle}>Top citizens making a difference.</p>
            </div>

            {/* The List */}
            <div style={styles.listContainer}>
                
                {/* 3. Logic: Check Loading First */}
                {loading ? (
                    <p style={{textAlign: 'center', color: '#888'}}>Loading rankings...</p>
                ) : leaders.length === 0 ? (
                    <div style={{textAlign: 'center', color: '#666', marginTop: '50px'}}>
                        <h3>No Data Found</h3>
                        <p>No active users found in the database yet.</p>
                    </div>
                ) : (
                    leaders.map((user) => (
                        <div key={user.rank} style={{
                            ...styles.row, 
                            border: user.rank === 1 ? '2px solid #ffd700' : '1px solid #333',
                            backgroundColor: user.rank === 1 ? 'rgba(255, 215, 0, 0.1)' : 'var(--bg-secondary, #1e1e1e)'
                        }}>
                            
                            {/* Rank Column */}
                            <div style={styles.rankCol}>
                                <span style={{fontSize: '1.5rem'}}>{getRankIcon(user.rank)}</span>
                            </div>

                            {/* User Info */}
                            <div style={styles.userCol}>
                                <h3 style={styles.username}>{user.username}</h3>
                                <span style={styles.levelBadge}>{user.level}</span>
                            </div>

                            {/* Points */}
                            <div style={styles.pointsCol}>
                                {user.points} <small>pts</small>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: '100vh',
        color: 'white',
        fontFamily: "'Inter', sans-serif"
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '10px',
        background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    subtitle: {
        color: '#888',
        fontSize: '1.1rem'
    },
    backBtn: {
        background: 'none',
        border: '1px solid #444',
        color: '#aaa',
        padding: '8px 15px',
        borderRadius: '20px',
        cursor: 'pointer',
        position: 'absolute',
        top: '20px',
        left: '20px'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '15px',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    },
    rankCol: {
        width: '60px',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    userCol: {
        flex: 1,
        paddingLeft: '20px'
    },
    username: {
        margin: 0,
        fontSize: '1.2rem',
        color: '#fff'
    },
    levelBadge: {
        fontSize: '0.8rem',
        background: '#333',
        padding: '3px 8px',
        borderRadius: '5px',
        color: '#ccc',
        marginTop: '5px',
        display: 'inline-block'
    },
    pointsCol: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: '#28a745'
    }
};

export default Leaderboard;