import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMap, FiAlertTriangle, FiLoader } from 'react-icons/fi';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 1. CUSTOM MARKER ICONS
const getMarkerIcon = (status) => {
    let color = '#ffb547'; 
    let glowColor = 'rgba(255, 181, 71, 0.6)';
    
    if (status === 'verified') { 
        color = '#007bff'; 
        glowColor = 'rgba(0, 123, 255, 0.6)'; 
    } 
    if (status === 'resolved') { 
        color = '#00d68f'; 
        glowColor = 'rgba(0, 214, 143, 0.4)'; 
    } 

    return L.divIcon({
        className: 'custom-pin',
        html: `<div style="
            width: 12px; height: 12px; background: ${color}; 
            border-radius: 50%; box-shadow: 0 0 10px ${glowColor}, 0 0 20px ${glowColor};
            border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
};

// 2. 12-HOUR AUTO-HIDE LOGIC
const shouldShowMarker = (report) => {
    if (report.status !== 'resolved') return true; // Always show Pending/Verified

    const resolvedDate = new Date(report.updated_at || report.created_at);
    const now = new Date();
    const diffInHours = (now - resolvedDate) / (1000 * 60 * 60);

    return diffInHours < 12; // Hide if resolved > 12h ago
};

const Community = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Default Center (Lucknow)
    const defaultCenter = [26.8467, 80.9462];

    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const res = await api.get('reports/'); 
                setReports(res.data);
            } catch (err) {
                console.error("Map Error:", err);
                setError("Unable to load live data.");
            } finally {
                setLoading(false);
            }
        };
        fetchGlobalData();
    }, []);

    const visibleReports = reports.filter(r => {
        const lat = parseFloat(r.latitude);
        const lng = parseFloat(r.longitude);
        return !isNaN(lat) && !isNaN(lng) && shouldShowMarker(r);
    });

    return (
        <div style={{padding: '20px', background: '#050509', minHeight: '100vh', color:'white'}}>
            
            <div style={{textAlign: 'center', marginBottom: '30px', paddingTop: '40px'}}>
                <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                    <FiMap color="#2970ff"/> Live City Intel
                </h1>
                <p style={{color: '#888'}}>
                    Real-time incidents reported by citizens. 
                    <span style={{color:'#00d68f', marginLeft:'8px', fontSize:'0.85rem'}}>
                        
                    </span>
                </p>
                
                {error && (
                    <div style={{marginTop: '20px', color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', padding: '10px', borderRadius:'8px', display:'inline-block'}}>
                        <FiAlertTriangle style={{marginRight: '8px'}}/> {error}
                    </div>
                )}
            </div>

            
            <div style={{
                height: '650px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '2px solid #2970ff',  // Blue Border
                boxShadow: '0 0 20px rgba(41, 112, 255, 0.3)', // Blue Glow
                marginBottom: '40px', 
                position: 'relative'
            }}>
                
                
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: 'linear-gradient(rgba(41, 112, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(41, 112, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px', 
                    pointerEvents: 'none', 
                    zIndex: 400, 
                    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
                }}></div>

                {loading ? (
                    <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#151621'}}>
                        <div style={{textAlign: 'center', color: '#2970ff'}}>
                            <FiLoader size={40} className="spin-animation" />
                            <p style={{marginTop:'15px'}}>Scanning Grid...</p>
                        </div>
                    </div>
                ) : (
                    <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        
                        {visibleReports.map((report) => (
                            <Marker 
                                key={report.id} 
                                position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
                                icon={getMarkerIcon(report.status)}
                            >
                                <Popup>
                                    <div style={{textAlign:'center'}}>
                                        <strong style={{fontSize:'1rem'}}>{report.title}</strong>
                                        <div style={{
                                            marginTop:'5px', padding:'4px 8px', borderRadius:'4px',
                                            backgroundColor: report.status === 'resolved' ? '#00d68f' : report.status === 'verified' ? '#007bff' : '#ffb547',
                                            color:'white', fontSize:'0.75rem', fontWeight:'bold', textTransform:'uppercase'
                                        }}>
                                            {report.status}
                                        </div>
                                        <p style={{margin:'5px 0 0 0', fontSize:'0.8rem', color:'#666'}}>
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
            <style>{`.spin-animation { animation: spin 2s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Community;