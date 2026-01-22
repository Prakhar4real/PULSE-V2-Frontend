import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const NewReport = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Infrastructure',
        location: '', // Starts empty
        image: null
    });

    // Auto-fetch location when page loads
    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const gps = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
                    setFormData(prev => ({ ...prev, location: gps }));
                },
                (error) => {
                    console.error("Location Error:", error);
                    alert("Could not fetch location. Please type it manually.");
                }
            );
        } else {
            alert("GPS not supported on this browser.");
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('location', formData.location || "Unknown Location");
        
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const res = await api.post('reports/', data);
            alert("Report Submitted! AI Status: " + (res.data.status === 'verified' ? 'Verified' : 'Pending Review'));
            navigate('/dashboard');
        } catch (error) {
            console.error("Error submitting report", error);
            alert("Failed to submit report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{textAlign:'center', marginBottom: '20px'}}>Report Incident</h2>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input name="title" placeholder="Issue Title (e.g., Pothole)" onChange={handleChange} style={styles.input} required />
                    
                    {/* LOCATION SECTION WITH BUTTON */}
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input 
                            name="location" 
                            value={formData.location} 
                            placeholder="Location (e.g. Sector 62)" 
                            onChange={handleChange} 
                            style={{...styles.input, flex: 1}} 
                            required 
                        />
                        <button type="button" onClick={getLocation} style={styles.gpsBtn}>
                            📍 Locate
                        </button>
                    </div>

                    <textarea name="description" placeholder="Describe what you see..." onChange={handleChange} style={{...styles.input, height: '80px'}} required />
                    
                    <div style={styles.group}>
                        <label>Evidence Photo</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{color: '#ccc'}} />
                    </div>

                    <button type="submit" style={loading ? styles.btnLoading : styles.btn} disabled={loading}>
                        {loading ? "AI is Analyzing..." : "Submit Report"}
                    </button>
                </form>
                
                <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>Cancel</button>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', color: 'white', padding: '20px' },
    card: { backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '500px', border: '1px solid #333' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    group: { display: 'flex', flexDirection: 'column', gap: '5px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2d2d2d', color: 'white', fontSize: '1rem' },
    btn: { marginTop: '10px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#28a745', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
    btnLoading: { marginTop: '10px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#555', color: '#ccc', fontSize: '1.1rem', cursor: 'not-allowed' },
    gpsBtn: { padding: '0 15px', borderRadius: '8px', border: '1px solid #007bff', backgroundColor: '#0056b3', color: 'white', cursor: 'pointer', fontSize: '0.9rem' },
    backBtn: { background: 'transparent', border: 'none', color: '#888', marginTop: '15px', width: '100%', cursor: 'pointer' }
};

export default NewReport;