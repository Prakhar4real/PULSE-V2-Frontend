import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiTarget, FiShield, FiStar, FiAward, FiUser } from 'react-icons/fi';

const LevelProgress = () => {
    const levels = [
        { name: "Citizen", xp: 0, icon: <FiUser />, color: "#8b8d9d" },
        { name: "Scout", xp: 100, icon: <FiTarget />, color: "#00d68f" },
        { name: "Guardian", xp: 300, icon: <FiShield />, color: "#2970ff" },
        { name: "Hero", xp: 500, icon: <FiStar />, color: "#ffd700" }
    ];

    return (
        <div style={styles.levelPanel}>
            <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #333', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiAward color="#ffb547" />
                {/*Clickable Link to open Rewards in a new tab */}
                <Link to="/rewards" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline', cursor: 'pointer' }}>
                    Ranks & Rewards
                </Link>
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                {/* Connecting Line */}
                <div style={{ position: 'absolute', top: '25px', left: '20px', right: '20px', height: '2px', backgroundColor: '#333', zIndex: 0 }}></div>

                {levels.map((lvl, index) => (
                    <div key={index} style={{ zIndex: 1, textAlign: 'center', backgroundColor: '#1e1e1e', padding: '0 5px' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '50%',
                            backgroundColor: '#252525', border: `2px solid ${lvl.color}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.2rem', color: lvl.color, margin: '0 auto 8px auto',
                            boxShadow: `0 0 10px ${lvl.color}40`
                        }}>
                            {lvl.icon}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'white' }}>{lvl.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>{lvl.xp}+ XP</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

//USER AVATAR
const UserAvatar = ({ user, rank }) => {
    let borderColor = '#333';
    if (rank === 0) borderColor = '#ffd700';
    if (rank === 1) borderColor = '#c0c0c0';
    if (rank === 2) borderColor = '#cd7f32';

    let imageUrl = null;
    if (user.profile_picture) {
        imageUrl = user.profile_picture.startsWith('http')
            ? user.profile_picture
            : `https://pulse-v2-backend.onrender.com${user.profile_picture}`;
    }

    return (
        <div style={{
            width: '45px', height: '45px', borderRadius: '50%',
            border: `2px solid ${borderColor}`, overflow: 'hidden',
            backgroundColor: '#1f2029', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: '15px', flexShrink: 0
        }}>
            {imageUrl ? (
                <img src={imageUrl} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <FiUser size={20} color="#8b8d9d" />
            )}
        </div>
    );
};

//MAIN PAGE COMPONENT
const Missions = () => {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);
    const [joiningId, setJoiningId] = useState(null);

    useEffect(() => {
        fetchGamificationData();
    }, []);

    const fetchGamificationData = async () => {
        try {
            const token = localStorage.getItem('access');
            const config = { headers: { Authorization: `Bearer ${token}` } };
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
        //loader
        setJoiningId(missionId);
        try {
            const token = localStorage.getItem('access');
            await api.post(`missions/${missionId}/join/`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchGamificationData();
        } catch (error) { 
            alert("Could not start mission."); 
        } finally {
            setJoiningId(null);
        }
    };

    const handleSubmitProof = async (missionId, file) => {
        if (!file) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
            alert("Image is too large! Please upload a photo smaller than 5MB.");
            return;
        }

        setUploadingId(missionId);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('access');
            const response = await api.post(`missions/${missionId}/submit_proof/`, formData, { headers: { Authorization: `Bearer ${token}` } });
            const data = response.data;

            // DYNAMIC POPUPS BASED ON AI GRADING
            if (data.status === 'verified') {
                alert(`🎉VERIFIED!\n\n${data.message}`);
                fetchGamificationData(); // Refresh to update XP and button to "START AGAIN"
            } 
            else if (data.status === 'failed') {
                alert(`REJECTED:\n\n${data.message}`);
                fetchGamificationData(); // Refresh to update button to "TRY AGAIN"
            } 
            else if (data.status === 'pending') {
                alert(`AI BUSY:\n\n${data.message}`);
                
                // Manually lock the UI to "Pending Review" so they don't spam uploads
                setMissions(prevMissions => 
                    prevMissions.map(m => m.id === missionId ? { ...m, status: 'under_review' } : m)
                );
            } 
            else {
                alert(data.message);
                fetchGamificationData();
            }

        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || "Upload failed. Please try again.";
            alert(`Error: ${errorMessage}`);
        } finally {
            setUploadingId(null);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
                <h1 style={{ margin: 0 }}>Hall of Fame</h1>
            </div>

            <div style={styles.grid}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <LevelProgress />

                    <div style={styles.panel}>
                        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>Top Contributors</h2>
                        {loading ? <p>Loading rankings...</p> : (
                            <ul style={styles.list}>
                                {leaderboard.map((user, index) => (
                                    <li key={index} style={styles.listItem}>
                                        <UserAvatar user={user} rank={index} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <strong style={{ color: index === 0 ? '#ffd700' : 'white', fontSize: '1.05rem' }}>
                                                    {user.username}
                                                </strong>
                                                {index === 0 && <span style={{ fontSize: '0.8rem' }}>👑</span>}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Level {user.level || 1}</div>
                                        </div>
                                        <span style={{ color: '#00d68f', fontWeight: 'bold' }}>{user.points} XP</span>
                                    </li>
                                ))}
                                {leaderboard.length === 0 && <p style={{ color: '#666', fontStyle: 'italic' }}>No top scouts yet.</p>}
                            </ul>
                        )}
                    </div>
                </div>

                <div style={styles.panel}>
                    <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>
                        <h2 style={{ margin: 0 }}>Active Missions</h2>
                        <p style={{ fontSize: '0.8rem', color: '#8b8d9d', margin: '5px 0 0 0' }}>Image upload limit: Max 5MB</p>
                    </div>
                    {loading ? <p>Loading missions...</p> : (
                        <div style={styles.missionGrid}>
                            {missions.map((mission) => (
                                <div key={mission.id} style={styles.missionCard}>
                                    <div style={{ fontSize: '2rem', padding: '10px', background: '#333', borderRadius: '10px' }}>{mission.icon || "🏆"}</div>
                                    <div style={{ flex: 1, padding: '0 15px' }}>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{mission.title}</h3>
                                        <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{mission.description}</p>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                       <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '8px' }}>+{mission.points} XP</div>

                                        {/* 1. UPLOADING LOADER */}
                                        {uploadingId === mission.id ? (
                                            <button style={{ ...styles.btnStart, opacity: 0.7, cursor: 'not-allowed', backgroundColor: '#ffb547', color: '#0b0c15' }} disabled>
                                                <span className="pulse-loader" style={{ width: '12px', height: '12px', borderWidth: '2px', marginRight: '6px', display: 'inline-block' }}></span>
                                                AI is analyzing...
                                            </button>
                                        ) : 

                                        /* 2. AI FAILED -> QUEUED FOR HUMAN REVIEW */
                                        mission.status === 'under_review' ? (
                                            <button style={{ ...styles.btnStart, backgroundColor: '#8b8d9d', cursor: 'not-allowed' }} disabled>
                                                PENDING REVIEW
                                            </button>
                                        ) : 

                                        /* 3. ALREADY JOINED -> READY TO UPLOAD (Pending, Completed, or Rejected) */
                                        (mission.status === 'pending' || mission.status === 'completed' || mission.status === 'rejected') ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <label style={{ 
                                                    ...styles.btnUpload, 
                                                    // Blue for completed, Red for rejected, Yellow for first-time upload
                                                    backgroundColor: mission.status === 'completed' ? '#2970ff' : (mission.status === 'rejected' ? '#ff4d4d' : '#ffb547'), 
                                                    color: mission.status === 'pending' ? '#0b0c15' : 'white', 
                                                    cursor: 'pointer',
                                                    textAlign: 'center'
                                                }}>
                                                    {mission.status === 'completed' ? 'UPLOAD NEW PROOF' : mission.status === 'rejected' ? 'TRY AGAIN' : 'UPLOAD PROOF'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleSubmitProof(mission.id, e.target.files[0])}
                                                        disabled={uploadingId !== null}
                                                    />
                                                </label>
                                            </div>
                                        ) : 

                                        /* 4. NOT JOINED YET -> SHOW "START" */
                                        (
                                            joiningId === mission.id ? (
                                                <button style={{ ...styles.btnStart, opacity: 0.7, cursor: 'not-allowed' }} disabled>
                                                    Starting...
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleJoinMission(mission.id)} 
                                                    style={{ ...styles.btnStart, backgroundColor: '#28a745' }}
                                                >
                                                    START
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                            {missions.length === 0 && <p style={{ color: '#666' }}>No active missions right now.</p>}
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
    btnStart: { backgroundColor: '#2970ff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' },
    btnUpload: { border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem', display: 'inline-block' },
};

export default Missions;