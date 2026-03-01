import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiCheckCircle, FiAlertCircle, FiMapPin, FiCalendar, FiExternalLink, FiImage, FiClock } from 'react-icons/fi';
import '../styles/History.css';

// HELPER: Generate Unique Case ID
const generateCaseId = (id) => {
    const uniquePart = (id + 10000).toString(16).toUpperCase(); 
    return `CASE-${uniquePart}`;
};

const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://pulse-v2-backend.onrender.com${path}`;
};


const getUserIdFromToken = () => {
    const token = localStorage.getItem('access');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id; 
    } catch (e) {
        console.error("Token decode failed", e);
        return null;
    }
};

const History = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('access');
            const res = await api.get('reports/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const userId = getUserIdFromToken();
            console.log("My User ID:", userId); // Debug Log

            
            const myReports = res.data.filter(r => {
                
                const reportUserId = typeof r.user === 'object' ? r.user.id : r.user;
                return reportUserId == userId;
            });

            setReports(myReports.sort((a, b) => b.id - a.id)); // Newest first
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return '#00d68f';
            case 'verified': return '#007bff';
            default: return '#ffb547';
        }
    };

    return (
        <div className="history-container">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Submission History</h1>
            <p style={{ color: '#8b8d9d', marginBottom: '40px' }}>
                You have contributed <span style={{ color: '#2970ff', fontWeight: 'bold' }}>{reports.length}</span> reports to the city.
            </p>

            {loading ? <p style={{textAlign:'center', color:'#888'}}>Loading records...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reports.map((report) => (
                        <div key={report.id} className="history-card">
                            
                            {/*1. USER UPLOADED PHOTO (CLICKABLE)*/}
                            <div className="history-img-container">
                                <a href={getImageUrl(report.image)} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src={getImageUrl(report.image)} 
                                        alt="Evidence" 
                                    />
                                    <div className="history-img-overlay">
                                        <FiExternalLink color="white" size={24} />
                                    </div>
                                </a>
                            </div>

                            {/*MIDDLE CONTENT */}
                            <div className="history-content">
                                <div className="history-header">
                                    <h3 className="history-title">{report.title}</h3>
                                    
                                    {/* 2. SHOW CASE ID */}
                                    <span className="history-case-id">
                                        {generateCaseId(report.id)}
                                    </span>
                                </div>

                                <div className="history-meta">
                                    <span className="meta-item">
                                        <FiMapPin /> {report.location || "Lucknow, India"}
                                    </span>
                                    <span className="meta-item">
                                        <FiCalendar /> {new Date(report.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="history-desc">
                                    {report.description || "No additional details provided."}
                                </p>

                                {/*ADMIN FEEDBACK SECTION*/}
                                {report.feedback && (
                                    <div className="admin-feedback-box">
                                        <span className="admin-label">
                                            Admin Feedback:
                                        </span>
                                        <p style={{ margin: '5px 0', color: '#e0e0e0', fontSize: '0.9rem' }}>
                                            {report.feedback}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/*RIGHT STATUS & PROOF*/}
                            <div className="history-actions">
                                <div className="status-badge" style={{
                                    borderColor: getStatusColor(report.status),
                                    color: getStatusColor(report.status)
                                }}>
                                    {report.status === 'resolved' ? <FiCheckCircle /> : 
                                     report.status === 'verified' ? <FiCheckCircle /> : <FiClock />}
                                    {report.status}
                                </div>

                                {/*  3.VIEW PROOF BUTTON */}
                                {report.resolved_image && (
                                    <a 
                                        href={getImageUrl(report.resolved_image)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="proof-btn"
                                    >
                                        <FiImage /> View Proof
                                    </a>
                                )}
                            </div>

                        </div>
                    ))}
                    
                    {reports.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#666', border: '2px dashed #333', borderRadius: '16px' }}>
                            <p>No reports found.</p>
                            <button 
                                onClick={() => window.location.href='/new-report'}
                                style={{marginTop: '10px', background: 'transparent', border:'1px solid #2970ff', color: '#2970ff', padding: '8px 16px', borderRadius: '6px', cursor:'pointer'}}
                            >
                                Create First Report
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default History;