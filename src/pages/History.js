import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiCalendar, FiMapPin, FiCheckCircle, FiClock, FiAlertCircle, FiXCircle } from 'react-icons/fi';

// --- HELPER: GET USER ID FROM TOKEN ---
const getUserIdFromToken = () => {
    const token = localStorage.getItem('access');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id; 
    } catch (e) {
        return null;
    }
};

const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
};

const History = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('access');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            try {
                // 1. Get the Real User ID
                const realUserId = getUserIdFromToken();

                // 2. Fetch All Reports
                const reportRes = await api.get('reports/', config);
                const allData = reportRes.data;

                // 3. Filter only MY reports
                const myReports = allData.filter(r => r.user == realUserId);
                
                // 4. Sort by Newest First
                setReports(myReports.sort((a, b) => b.id - a.id));

            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getStatusConfig = (status) => {
        switch(status) {
            case 'resolved': return { color: '#00d68f', icon: <FiCheckCircle /> };
            case 'verified': return { color: '#007bff', icon: <FiCheckCircle /> };
            case 'rejected': return { color: '#ff4d4d', icon: <FiXCircle /> };
            default: return { color: '#ffb547', icon: <FiClock /> }; 
        }
    };

    if (loading) return <div style={{padding: '50px', color: 'white', textAlign: 'center'}}>Loading Logbook...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Submission History</h1>
                <p style={styles.subtitle}>
                    You have contributed <span style={{color: '#2970ff', fontWeight: 'bold'}}>{reports.length}</span> reports to the city.
                </p>
            </div>

            <div style={styles.listContainer}>
                {reports.length === 0 ? (
                    <div style={styles.emptyState}>
                        <h3>No records found</h3>
                        <p>Once you report an issue, it will appear here permanently.</p>
                    </div>
                ) : (
                    reports.map(report => {
                        const statusConfig = getStatusConfig(report.status);
                        return (
                            <div key={report.id} style={styles.row}>
                                
                                {/* 1. Image Thumbnail */}
                                <div style={styles.imgContainer}>
                                    {report.image ? (
                                        <img src={getImageUrl(report.image)} alt="Evidence" style={styles.img} />
                                    ) : (
                                        <div style={styles.noImg}><FiAlertCircle size={24} color="#666"/></div>
                                    )}
                                </div>

                                {/* 2. Details & Feedback */}
                                <div style={{flex: 1}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                                        <h3 style={styles.reportTitle}>{report.title}</h3>
                                        <span style={{fontSize: '0.8rem', color: '#666'}}>ID: #{report.id}</span>
                                    </div>
                                    
                                    <div style={styles.metaRow}>
                                        <span style={styles.metaItem}>
                                            <FiMapPin color="#2970ff"/> {report.location || "No GPS Data"}
                                        </span>
                                        {report.created_at && (
                                            <span style={styles.metaItem}>
                                                <FiCalendar color="#2970ff"/> {new Date(report.created_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p style={styles.desc}>
                                        {report.description 
                                            ? (report.description.length > 120 ? report.description.substring(0, 120) + "..." : report.description)
                                            : "No description provided."}
                                    </p>

                                    
                                    {report.feedback && (
                                        <div style={{marginTop: '12px', padding: '10px', background: 'rgba(0, 214, 143, 0.1)', borderLeft: '3px solid #00d68f', borderRadius: '4px', fontSize: '0.9rem'}}>
                                            <span style={{color: '#00d68f', fontWeight: 'bold'}}>ADMIN:</span> <span style={{color: '#e0e0e0'}}>{report.feedback}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Status Badge & Proof */}
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '120px'}}>
                                    <div style={{
                                        ...styles.statusBadge, 
                                        borderColor: statusConfig.color, 
                                        color: statusConfig.color,
                                        backgroundColor: `${statusConfig.color}15`
                                    }}>
                                        {statusConfig.icon} 
                                        <span>{report.status.toUpperCase()}</span>
                                    </div>

                                    
                                    {report.resolved_image && (
                                        <a href={getImageUrl(report.resolved_image)} target="_blank" rel="noopener noreferrer" style={{fontSize: '0.85rem', color: '#00d68f', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500'}}>
                                            View Proof
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 10%', 
        minHeight: '100vh',
        backgroundColor: '#050509',
        color: 'white',
        fontFamily: "'Inter', sans-serif"
    },
    header: { marginBottom: '40px', borderBottom: '1px solid #1f2029', paddingBottom: '20px' },
    title: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' },
    subtitle: { color: '#888', fontSize: '1.1rem' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
    emptyState: { 
        textAlign: 'center', color: '#666', padding: '60px', 
        border: '2px dashed #1f2029', borderRadius: '16px' 
    },
    row: {
        display: 'flex', alignItems: 'start', gap: '25px', 
        padding: '25px', backgroundColor: '#151621',
        borderRadius: '16px', border: '1px solid #1f2029',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    imgContainer: {
        width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0,
        backgroundColor: '#000', border: '1px solid #2a2b3d'
    },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    reportTitle: { margin: '0 0 8px 0', fontSize: '1.3rem', color: '#fff' },
    metaRow: { display: 'flex', gap: '20px', color: '#aaa', fontSize: '0.9rem', marginBottom: '12px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '6px' },
    desc: { margin: 0, color: '#888', fontSize: '0.95rem', lineHeight: '1.5' },
    statusBadge: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
        padding: '10px 15px', borderRadius: '12px',
        fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px',
        border: '1px solid', width: '100%', textAlign: 'center'
    }
};

export default History;