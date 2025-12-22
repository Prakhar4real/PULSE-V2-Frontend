import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- 1. FIX DEFAULT LEAFLET ICONS ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// --- 2. CREATE THE "GOOGLE STYLE" BLUE DOT ICON ---
const createLocationIcon = () => {
    return L.divIcon({
        className: 'user-location-marker',
        html: `
            <div class="location-circle"></div>
            <div class="location-pulse"></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10] // Center the dot
    });
};

// --- 3. LOCATE ME COMPONENT (Updated) ---
const LocateControl = () => {
    const map = useMap();
    const [position, setPosition] = useState(null);

    const handleLocate = () => {
        map.locate({ setView: true, maxZoom: 16 }); // Zoom in like Google Maps
    };

    // Listen for location found
    useEffect(() => {
        const onLocationFound = (e) => {
            setPosition(e.latlng);
            // Optional: Draw a "Blue Accuracy Circle" around the dot
            L.circle(e.latlng, { radius: e.accuracy / 2 }).addTo(map);
        };

        map.on('locationfound', onLocationFound);
        return () => {
            map.off('locationfound', onLocationFound);
        };
    }, [map]);

    return (
        <>
            {/* The Button */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
                <button onClick={handleLocate} style={styles.locateBtn}>
                    Locate Me
                </button>
            </div>

            {/* The Blue Dot Marker */}
            {position && (
                <Marker position={position} icon={createLocationIcon()}>
                    <Popup>You are here</Popup>
                </Marker>
            )}
        </>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    <button onClick={() => navigate('/missions')} style={{...styles.mainBtn, backgroundColor: '#ffc107', color: 'black', marginRight: '10px'}}>
    🏆 Leaderboard
</button>

    const checkUserStatus = async () => {
        try {
            const profileRes = await api.get('user/profile/');
            setUser(profileRes.data);
            const reportRes = await api.get('reports/');
            setReports(reportRes.data);
        } catch (error) {
            console.log("Guest view");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Fix Image URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://127.0.0.1:8000${imagePath}`;
    };

    return (
        <div style={styles.container}>
            {/* CSS STYLES FOR THE BLUE DOT */}
            <style>
                {`
                    .user-location-marker {
                        background: transparent;
                        border: none;
                    }
                    /* The solid blue dot */
                    .location-circle {
                        width: 14px;
                        height: 14px;
                        background-color: #4285F4; /* Google Blue */
                        border: 2px solid white;
                        border-radius: 50%;
                        position: absolute;
                        top: 3px;
                        left: 3px;
                        z-index: 2;
                        box-shadow: 0 0 5px rgba(0,0,0,0.3);
                    }
                    /* The pulsing effect */
                    .location-pulse {
                        width: 100%;
                        height: 100%;
                        background-color: rgba(66, 133, 244, 0.4);
                        border-radius: 50%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        animation: pulse 2s infinite;
                        z-index: 1;
                    }
                    @keyframes pulse {
                        0% { transform: scale(0.5); opacity: 1; }
                        100% { transform: scale(2.5); opacity: 0; }
                    }
                `}
            </style>

            <div style={styles.header}>
                <div>
                    <h1 style={{fontSize: '2.5rem', marginBottom: '5px'}}>Command Center</h1>
                    <p style={{color: '#888'}}>
                        System Status: <span style={{color: '#00ff88'}}>Online</span> • {user ? `${reports.length} Active Reports` : "Public Access"}
                    </p>
                </div>
                {user && <button onClick={() => navigate('/new-report')} style={styles.mainBtn}>+ New Incident</button>}
            </div>

            <div style={styles.mapContainer}>
                <MapContainer center={[28.4744, 77.5040]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    
                    {/* ADDED LOCATE CONTROL HERE */}
                    <LocateControl /> 

                    {reports.map((report) => (
                        <Marker key={report.id} position={[28.4744, 77.5040]}> 
                            <Popup><strong>{report.title}</strong><br/>{report.description}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <h3 style={{marginTop: '30px', color: '#ccc'}}>Recent Activity</h3>
            
            {loading ? <p>Loading...</p> : user ? (
                <div style={styles.grid}>
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h4 style={{margin: 0}}>{report.title}</h4>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '5px', fontSize: '0.8rem',
                                        backgroundColor: report.status === 'verified' ? '#28a745' : '#ffc107',
                                        color: 'black', fontWeight: 'bold'
                                    }}>
                                        {report.status.toUpperCase()}
                                    </span>
                                </div>
                                
                                {report.image ? (
                                    <img 
                                        src={getImageUrl(report.image)} 
                                        alt="Evidence" 
                                        style={styles.image} 
                                        onError={(e) => {e.target.style.display='none'}}
                                    />
                                ) : (
                                    <div style={styles.noImage}>No Image</div>
                                )}

                                <p style={{color: '#aaa', fontSize: '0.9rem', margin: '10px 0'}}>{report.description}</p>
                                <div style={{fontSize: '0.8rem', color: '#666'}}>📍 {report.location}</div>
                            </div>
                        ))
                    ) : (
                        <p style={{color: '#666'}}>No reports yet.</p>
                    )}
                </div>
            ) : (
                <div style={styles.guestBox}>
                    <h3>Restricted Access</h3>
                    <button onClick={() => navigate('/login')} style={styles.btn}>Log In or Sign IN to View Reports</button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '40px', minHeight: '100vh', color: 'white' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    mainBtn: { padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    mapContainer: { height: '300px', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333', marginBottom: '30px', position: 'relative' },
    locateBtn: { padding: '8px 12px', backgroundColor: 'white', color: 'black', border: '2px solid #ccc', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #333' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    image: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#333' },
    noImage: { width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2d2d2d', borderRadius: '8px', color: '#555', marginBottom: '10px' },
    guestBox: { textAlign: 'center', padding: '50px', backgroundColor: '#1e1e1e', borderRadius: '15px', border: '1px dashed #555' },
    btn: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Dashboard;