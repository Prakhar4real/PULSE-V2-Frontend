import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// --- COMPONENT: CELEBRATION MODAL ---
const CelebrationModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.box}>
                <div style={{fontSize: '3rem'}}>🎉</div>
                <h2 style={{color: '#ffd700', marginTop: '10px'}}>Mission Accomplished!</h2>
                <p style={{fontSize: '1.2rem', margin: '20px 0'}}>{message}</p>
                <button onClick={onClose} style={modalStyles.btn}>Collect XP</button>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    box: { backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '2px solid #ffd700', maxWidth: '400px', width: '90%' },
    btn: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '12px 24px', fontSize: '1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

// --- MAIN PAGE COMPONENT ---
const Missions = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State for the Popup
    const [successMsg, setSuccessMsg] = useState(null); 

    useEffect(() => {
        fetchGamificationData();
    }, []);

    const fetchGamificationData = async () => {
        try {
            const lbRes = await api.get('leaderboard/');
            const msRes = await api.get('missions/');
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
            await api.post(`missions/${missionId}/join/`);
            alert("Mission Started! Good luck, Champ.");
            fetchGamificationData();
        } catch (error) {
            console.error("Error joining mission", error);
            alert("Could not join mission.");
        }
    };

    const handleSubmitProof = async (missionId, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            console.log("AI is analyzing..."); // Optional: Add a toaster/spinner here
            
            const res = await api.post(`missions/${missionId}/submit_proof/`, formData);
            
            if (res.data.status === 'verified') {
                
                setSuccessMsg(res.data.message); 
            } else {
                alert(res.data.message); // Keep alert for errors/rejections
            }
            fetchGamificationData(); 
        } catch (error) {
            console.error("Error submitting proof", error);
            alert("Upload failed. Please try again.");
        }
    };

    const getRankEmoji = (index) => {
        if (index === 0) return "👑";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    return (
        <div style={styles.container}>
            {/* The Celebration Modal (Hidden unless successMsg has text) */}
            <CelebrationModal message={successMsg} onClose={() => setSuccessMsg(null)} />

            {/* Header Section */}
            <div style={styles.header}>
                <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
                <h1 style={{margin: 0}}>Hall of Fame</h1>
            </div>

            <div style={styles.grid}>
                {/* --- LEADERBOARD SECTION --- */}
                <div style={styles.panel}>
                    <h2 style={{borderBottom: '1px solid #333', paddingBottom: '10px'}}>Top Scouts</h2>
                    {loading ? <p>Loading rankings...</p> : (
                        <ul style={styles.list}>
                            {leaderboard.map((user, index) => (
                                <li key={index} style={styles.listItem}>
                                    <span style={{fontSize: '1.2rem', width: '30px'}}>{getRankEmoji(index)}</span>
                                    <div style={{flex: 1, marginLeft: '10px'}}>
                                        <strong>{user.username}</strong>
                                        <div style={{fontSize: '0.8rem', color: '#888'}}>{user.level}</div>
                                    </div>
                                    <span style={{color: '#ffd700', fontWeight: 'bold'}}>{user.points} XP</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* --- MISSIONS SECTION --- */}
                <div style={styles.panel}>
                    <h2 style={{borderBottom: '1px solid #333', paddingBottom: '10px'}}>Active Missions</h2>
                    {loading ? <p>Loading missions...</p> : (
                        <div style={styles.missionGrid}>
                            {missions.map((mission) => (
                                <div key={mission.id} style={styles.missionCard}>
                                    <div style={{fontSize: '2rem'}}>{mission.icon || "📜"}</div>
                                    <div style={{flex: 1, padding: '0 15px'}}>
                                        <h3 style={{margin: '0 0 5px 0'}}>{mission.title}</h3>
                                        <p style={{fontSize: '0.8rem', color: '#aaa', margin: 0}}>{mission.description}</p>
                                    </div>
                                    <div style={{textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                                        <div style={{color: '#ffd700', fontWeight: 'bold', marginBottom: '5px'}}>+{mission.points} XP</div>
                                        
                                        {/* BUTTON LOGIC */}
                                        {mission.status === 'completed' && (
                                            <span style={styles.badgeDone}>✅ COMPLETED</span>
                                        )}

                                        {mission.status === 'available' && (
                                            <button 
                                                onClick={() => handleJoinMission(mission.id)} 
                                                style={styles.btnStart}
                                            >
                                                CLICK TO START
                                            </button>
                                        )}

                                        {mission.status === 'pending' && (
                                            <label style={styles.btnUpload}>
                                                📷 Upload Proof
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    style={{display: 'none'}} 
                                                    onChange={(e) => handleSubmitProof(mission.id, e.target.files[0])}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div> 
        </div> 
    );
};

const styles = {
    container: { padding: '40px', minHeight: '100vh', backgroundColor: '#121212', color: 'white' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
    backBtn: { background: 'none', border: '1px solid #555', color: 'white', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
    panel: { backgroundColor: '#1e1e1e', borderRadius: '15px', padding: '25px', border: '1px solid #333' },
    
    list: { listStyle: 'none', padding: 0, margin: 0 },
    listItem: { display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #2d2d2d' },
    
    missionGrid: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
    missionCard: { display: 'flex', alignItems: 'center', backgroundColor: '#252525', padding: '15px', borderRadius: '10px', border: '1px solid #333', transition: '0.2s' },
    
    badgeDone: { fontSize: '0.7rem', backgroundColor: '#28a745', color: 'white', padding: '3px 8px', borderRadius: '4px' },
    badgeActive: { fontSize: '0.7rem', backgroundColor: '#007bff', color: 'white', padding: '3px 8px', borderRadius: '4px' },
    badgeStart: { fontSize: '0.7rem', backgroundColor: '#ffc107', color: 'black', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' },

    btnStart: { backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem' },
    btnUpload: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.7rem', display: 'inline-block' },
};

export default Missions;