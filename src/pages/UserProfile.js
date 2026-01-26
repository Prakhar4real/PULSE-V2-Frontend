import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiArrowLeft, FiCamera, FiSave, FiEdit2, FiAward, FiTarget, FiPhone } from 'react-icons/fi';

const UserProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Data State
    const [userData, setUserData] = useState({
        username: '', email: '', bio: '', phone_number: '', profile_picture: null,
        points: 0, level: 'Citizen' 
    });
    
    // Upload State
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await api.get('user/profile/', { headers: { Authorization: `Bearer ${token}` } });
            setUserData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Profile Load Error", error);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        // Send Bio only if it exists
        if (userData.bio) formData.append('bio', userData.bio);
        // Send Phone only if it exists
        if (userData.phone_number) formData.append('phone_number', userData.phone_number);
        
        if (selectedFile) {
            formData.append('profile_picture', selectedFile);
        }

        try {
            const token = localStorage.getItem('access');
            const res = await api.patch('user/update/', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Profile Updated Successfully!");
            setIsEditing(false);
            
            setUserData(res.data); 
        } catch (error) {
            console.error("Update Error", error);
            alert("Failed to update. Check connection.");
        }
    };

    

                    
                    <div>
                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <label style={{color: '#8b8d9d', fontSize: '0.85rem'}}>Phone</label>
                            {!isEditing && <FiEdit2 style={{cursor:'pointer', color:'#2970ff'}} onClick={() => setIsEditing(true)}/>}
                         </div>
                         
                         {isEditing ? (
                            <input 
                                type="text" 
                                name="phone_number" // Added name
                                value={userData.phone_number || ""} // Handle null value
                                onChange={(e) => setUserData({...userData, phone_number: e.target.value})}
                                style={styles.input} 
                                placeholder="+91 99999 99999"
                            />
                        ) : (
                            <div style={{color: 'white', fontSize: '1rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <FiPhone color="#00d68f"/>
                                
                                {userData.phone_number ? userData.phone_number : <span style={{color: '#555', fontStyle: 'italic'}}>Not set</span>}
                            </div>
                        )}
                    </div>

    if (loading) return <div style={{padding: 40, color: 'white'}}>Loading Profile...</div>;

    const imageUrl = previewUrl 
        ? previewUrl 
        : (userData.profile_picture ? (userData.profile_picture.startsWith('http') ? userData.profile_picture : `http://127.0.0.1:8000${userData.profile_picture}`) : null);

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#0b0c15', color: 'white', padding: '20px'}}>
            <button onClick={() => navigate('/dashboard')} style={{background: 'none', border: 'none', color: '#2970ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20}}>
                <FiArrowLeft /> Back to Dashboard
            </button>

            <div style={{maxWidth: '500px', margin: '0 auto', background: '#151621', padding: '40px', borderRadius: '20px', border: '1px solid #2a2b3d', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'}}>
                
                {/* --- PROFILE PICTURE --- */}
                <div style={{textAlign: 'center', marginBottom: 20, position: 'relative'}}>
                    <div style={{
                        width: 120, height: 120, borderRadius: '50%', 
                        background: '#1f2029', margin: '0 auto', overflow: 'hidden',
                        border: '4px solid #2970ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative'
                    }}>
                        {imageUrl ? (
                            <img src={imageUrl} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                            <FiUser size={50} color="#8b8d9d"/>
                        )}
                    </div>

                    <label style={{
                        position: 'absolute', bottom: '0px', left: '55%', 
                        backgroundColor: '#00d68f', width: '35px', height: '35px', borderRadius: '50%', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '2px solid #151621'
                    }}>
                        <FiCamera size={18} color="black" />
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
                    </label>
                </div>

                <div style={{textAlign: 'center', marginBottom: '25px'}}>
                    <h2 style={{margin: '0 0 5px 0', fontSize: '1.8rem'}}>{userData.username}</h2>
                    <p style={{color: '#8b8d9d', margin: 0}}>{userData.email}</p>
                    
                    {/* STATS PILLS */}
                    <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px'}}>
                        <div style={styles.badge}>
                            <FiAward color="#ffd700"/> {userData.points} XP
                        </div>
                        <div style={{...styles.badge, borderColor: '#2970ff', color: '#2970ff'}}>
                            <FiTarget /> {userData.level}
                        </div>
                    </div>
                </div>

                {/* --- EDITABLE FIELDS --- */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    
                    {/* BIO SECTION */}
                    <div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <label style={{color: '#8b8d9d', fontSize: '0.85rem'}}>About Me</label>
                            {/* Edit Button for Bio */}
                            {!isEditing && <FiEdit2 style={{cursor:'pointer', color:'#2970ff'}} onClick={() => setIsEditing(true)}/>}
                        </div>
                        {isEditing ? (
                            <textarea 
                                value={userData.bio} 
                                onChange={(e) => setUserData({...userData, bio: e.target.value})}
                                style={styles.input} rows="3" placeholder="Tell us about yourself..."
                            />
                        ) : (
                            <div style={{padding: '10px', backgroundColor: '#0b0c15', borderRadius: '8px', color: '#ccc', minHeight: '40px', fontSize: '0.95rem'}}>
                                {userData.bio || "No bio added yet."}
                            </div>
                        )}
                    </div>

                    {/* PHONE SECTION (Now with Edit Button!) */}
                    <div>
                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                            <label style={{color: '#8b8d9d', fontSize: '0.85rem'}}>Phone</label>
                            
                            {!isEditing && <FiEdit2 style={{cursor:'pointer', color:'#2970ff'}} onClick={() => setIsEditing(true)}/>}
                         </div>
                         
                         {isEditing ? (
                            <input 
                                type="text" value={userData.phone_number} 
                                onChange={(e) => setUserData({...userData, phone_number: e.target.value})}
                                style={styles.input} placeholder="+91 99999 99999"
                            />
                        ) : (
                            <div style={{color: 'white', fontSize: '1rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <FiPhone color="#00d68f"/>
                                {userData.phone_number || "Not set"}
                            </div>
                        )}
                    </div>
                </div>

                {/* SAVE BUTTONS */}
                {(isEditing || selectedFile) && (
                    <div style={{display: 'flex', gap: '10px', marginTop: '30px'}}>
                        <button onClick={handleSave} style={{...styles.saveBtn, marginTop: 0}}>
                            <FiSave /> Save Changes
                        </button>
                        <button onClick={() => setIsEditing(false)} style={{...styles.saveBtn, marginTop: 0, backgroundColor: '#333'}}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    input: {
        width: '100%', padding: '12px', backgroundColor: '#0b0c15', 
        border: '1px solid #333', borderRadius: '8px', color: 'white', 
        fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit'
    },
    saveBtn: {
        flex: 1, padding: '15px', borderRadius: '10px', border: 'none', 
        backgroundColor: '#2970ff', color: 'white', fontWeight: 'bold', fontSize: '1rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
    },
    badge: {
        display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 15px', 
        borderRadius: '20px', border: '1px solid #ffd700', color: '#ffd700', fontWeight: 'bold', fontSize: '0.9rem'
    }
};

export default UserProfile;