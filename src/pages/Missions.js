import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiTarget, FiShield, FiStar, FiAward, FiUser } from 'react-icons/fi';

// --- COMPONENT: LEVEL PROGRESSION CARD ---
const LevelProgress = () => {
    const levels = [
        { name: "Citizen", xp: 0, icon: <FiUser />, color: "#8b8d9d" },
        { name: "Scout", xp: 100, icon: <FiTarget />, color: "#00d68f" },
        { name: "Guardian", xp: 300, icon: <FiShield />, color: "#2970ff" },
        { name: "Hero", xp: 500, icon: <FiStar />, color: "#ffd700" }
    ];

    return (
        <div style={styles.levelPanel}>
            <h3 style={{margin: '0 0 15px 0', borderBottom: '1px solid #333', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <FiAward color="#ffb547"/> Rank Progression
            </h3>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'}}>
                {/* Connecting Line */}
                <div style={{position: 'absolute', top: '25px', left: '20px', right: '20px', height: '2px', backgroundColor: '#333', zIndex: 0}}></div>
                
                {levels.map((lvl, index) => (
                    <div key={index} style={{zIndex: 1, textAlign: 'center', backgroundColor: '#1e1e1e', padding: '0 5px'}}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%', 
                            backgroundColor: '#252525', border: `2px solid ${lvl.color}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', color: lvl.color, margin: '0 auto 8px auto',
                            boxShadow: `0 0 10px ${lvl.color}40`
                        }}>
                            {lvl.icon}
                        </div>
                        <div style={{fontWeight: 'bold', fontSize: '0.9rem', color: 'white'}}>{lvl.name}</div>
                        <div style={{fontSize: '0.75rem', color: '#888'}}>{lvl.xp}+ XP</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENT: USER AVATAR (For Leaderboard) ---
const UserAvatar = ({ user, rank }) => {
    // 1. Determine Border Color based on Rank
    let borderColor = '#333'; // Default
    if (rank === 0) borderColor = '#ffd700'; // Gold
    if (rank === 1) borderColor = '#c0c0c0'; // Silver
    if (rank === 2) borderColor = '#cd7f32'; // Bronze

    // 2. Get Image URL
    let imageUrl = null;
    if (user.profile_picture) {
        imageUrl = user.profile_picture.startsWith('http') 
            ? user.profile_picture 
            : `http://127.0.0.1:8000${user.profile_picture}`;
    }

    return (
        <div style={{
            width: '45px', height: '45px', borderRadius: '50%', 
            border: `2px solid ${borderColor}`, overflow: 'hidden',
            backgroundColor: '#1f2029', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: '15px', flexShrink: 0
        }}>
            {imageUrl ? (
                <img src={imageUrl} alt={user.username} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
                <FiUser size={20} color="#8b8d9d"/>
            )}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const Missions = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGamificationData();
    }, []);

    const fetchGamificationData = async () => {
        try {
            const token = localStorage.getItem('access');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Fetch both endpoints in parallel
            const [lbRes, msRes] = await Promise.all([
                api.get('leaderboard/', config),
                api.get('missions/', config)
            ]);
            
            setLeaderboard(lbRes.data);
            setMissions(msRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleJoinMission = async (missionId) => {
        try {
            const token = localStorage.getItem('access');
            await api.post(`missions/${missionId}/join/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            alert("Mission Started! Good luck.");
            fetchGamificationData();
        } catch (error) { alert("Could not join mission."); }
    };

    const handleSubmitProof = async (missionId, file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const token = localStorage.getItem('access');
            await api.post(`missions/${missionId}/submit_proof/`, formData, { headers: { Authorization: `Bearer ${token}` } });
            alert("Proof Submitted! Check back later for verification."); 
            fetchGamificationData(); 
        } catch (error) { alert("Upload failed. Please try again."); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
                <h1 style={{margin: 0}}>Hall of Fame</h1>
            </div>

            <div style={styles.grid}>
                {/* LEFT COLUMN: Stats & Leaderboard */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    
                    {/* 1. Level Progress Bar */}
                    <LevelProgress />
                    
                    {/* 2. Top Contributors List */}
                    <div style={styles.panel}>
                        <h2 style={{borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0}}>Top Contributors</h2>
                        {loading ? <p>Loading rankings...</p> : (
                            <ul style={styles.list}>
                                {leaderboard.map((user, index) => (
                                    <li key={index} style={styles.listItem}>
                                        {/* AVATAR + RANK BORDER */}
                                        <UserAvatar user={user} rank={index} />
                                        
                                        <div style={{flex: 1}}>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                <strong style={{color: index === 0 ? '#ffd700' : 'white', fontSize: '1.05rem'}}>
                                                    {user.username}
                                                </strong>
                                                {index === 0 && <span style={{fontSize: '0.8rem'}}>👑</span>}
                                            </div>
                                            <div style={{fontSize: '0.8rem', color: '#888'}}>Level {user.level || 1}</div>
                                        </div>
                                        <span style={{color: '#00d68f', fontWeight: 'bold'}}>{user.points} XP</span>
                                    </li>
                                ))}
                                {leaderboard.length === 0 && <p style={{color: '#666', fontStyle: 'italic'}}>No top scouts yet.</p>}
                            </ul>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Active Missions */}
                <div style={styles.panel}>
                    <h2 style={{borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0}}>Active Missions</h2>
                    {loading ? <p>Loading missions...</p> : (
                        <div style={styles.missionGrid}>
                            {missions.map((mission) => (
                                <div key={mission.id} style={styles.missionCard}>
                                    <div style={{fontSize: '2rem', padding: '10px', background: '#333', borderRadius: '10px'}}>{mission.icon || "🏆"}</div>
                                    <div style={{flex: 1, padding: '0 15px'}}>
                                        <h3 style={{margin: '0 0 5px 0'}}>{mission.title}</h3>
                                        <p style={{fontSize: '0.8rem', color: '#aaa', margin: 0}}>{mission.description}</p>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <div style={{color: '#ffd700', fontWeight: 'bold', marginBottom: '8px'}}>+{mission.points} XP</div>
                                        
                                        {/* ACTION BUTTONS */}
                                        {mission.status === 'available' && (
                                            <button onClick={() => handleJoinMission(mission.id)} style={styles.btnStart}>START</button>
                                        )}
                                        {mission.status === 'pending' && (
                                            <label style={styles.btnUpload}>
                                                📷 Upload Proof
                                                <input type="file" style={{display:'none'}} onChange={(e) => handleSubmitProof(mission.id, e.target.files[0])}/>
                                            </label>
                                        )}
                                        {mission.status === 'completed' && (
                                            <span style={styles.badgeDone}>✅ COMPLETED</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {missions.length === 0 && <p style={{color: '#666'}}>No active missions right now.</p>}
                        </div>
                    )}
                </div>
            </div> 
        </div> 
    );
};

const styles = {
    container: { padding: '40px', minHeight: '100vh', backgroundColor: '#0b0c15', color: 'white' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
    backBtn: { background: 'none', border: '1px solid #555', color: 'white', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', transition: '0.3s' },
    
    grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', alignItems: 'start' }, 
    
    panel: { backgroundColor: '#151621', borderRadius: '15px', padding: '25px', border: '1px solid #2a2b3d' },
    levelPanel: { backgroundColor: '#151621', borderRadius: '15px', padding: '20px', border: '1px solid #2a2b3d' },
    
    list: { listStyle: 'none', padding: 0, margin: 0 },
    listItem: { display: 'flex', alignItems: 'center', padding: '15px 10px', borderBottom: '1px solid #2a2b3d' },
    
    missionGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
    missionCard: { display: 'flex', alignItems: 'center', backgroundColor: '#1f2029', padding: '15px', borderRadius: '12px', border: '1px solid #2a2b3d' },
    
    badgeDone: { fontSize: '0.7rem', backgroundColor: '#00d68f', color: '#0b0c15', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold' },
    btnStart: { backgroundColor: '#2970ff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' },
    btnUpload: { backgroundColor: '#ffb547', color: '#0b0c15', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', display: 'inline-block' },
};

export default Missions;