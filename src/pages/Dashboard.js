import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import axios from 'axios';

// --- LEAFLET MAP IMPORTS ---
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat'; 

// --- CHARTS & ICONS ---
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts'; 
import { FiWind, FiSun, FiMapPin, FiUser, FiCrosshair } from 'react-icons/fi'; 

// --- STYLES ---
import '../styles/DashboardNew.css';

// --- 1. DYNAMIC COLORED PINS ---

const getMarkerIcon = (status) => {
    let color = '#ffb547'; // Default Yellow (Pending)
    let glowColor = 'rgba(255, 181, 71, 0.6)';
    
    if (status === 'verified') {
        color = '#007bff'; // Blue
        glowColor = 'rgba(0, 123, 255, 0.6)';
    }
    if (status === 'resolved') {
        color = '#00d68f'; // Green
        
        glowColor = 'rgba(0, 214, 143, 0.2)'; 
    }

    // We use a CSS-based marker instead of an SVG image for a cleaner look
    return L.divIcon({
        className: 'pro-pin-container',
        html: `
            <div class="pro-pin-glow" style="background: ${glowColor}"></div>
            <div class="pro-pin-core" style="background: ${color}">
                <div class="pro-pin-center"></div>
            </div>
        `,
        iconSize: [30, 30], // Overall size area
        iconAnchor: [15, 15], // Center the icon right on the lat/lng point
        popupAnchor: [0, -15] // Popup opens slightly above it
    });
};

// --- 2. TRAFFIC HEATMAP COMPONENT ---
const TrafficHeatmap = ({ reports }) => {
    const map = useMap();

    useEffect(() => {
        const trafficPoints = reports
            .filter(r => 
                (r.category && r.category.toLowerCase() === 'traffic') || 
                r.title.toLowerCase().includes('traffic') || 
                r.title.toLowerCase().includes('jam') ||
                r.description.toLowerCase().includes('blocked')
            )
            .map(r => {
                return [28.4744 + (Math.random() * 0.01 - 0.005), 77.5040 + (Math.random() * 0.01 - 0.005), 1.0]; 
            });

        if (trafficPoints.length > 0) {
            const heat = L.heatLayer(trafficPoints, {
                radius: 30,
                blur: 20,
                maxZoom: 17,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            }).addTo(map);

            return () => { map.removeLayer(heat); };
        }
    }, [reports, map]);

    return null;
};

// --- 3. GOOGLE-STYLE BLUE DOT ICON ---
const createLocationIcon = () => {
    return L.divIcon({
        className: 'user-location-marker',
        html: `
            <div class="location-circle"></div>
            <div class="location-pulse"></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

// --- 4. LOCATE ME CONTROL ---
const LocateControl = () => {
    const map = useMap();
    const [position, setPosition] = useState(null);

    const handleLocate = () => {
        map.locate({ setView: true, maxZoom: 16 });
    };

    useEffect(() => {
        const onLocationFound = (e) => {
            setPosition(e.latlng);
        };
        map.on('locationfound', onLocationFound);
        return () => {
            map.off('locationfound', onLocationFound);
        };
    }, [map]);

    return (
        <>
            <button 
                onClick={handleLocate} 
                style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 1000,
                    background: '#2970ff', border: 'none', color: 'white',
                    padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold'
                }}
            >
                <FiCrosshair /> Locate Me
            </button>
            {position && (
                <Marker position={position} icon={createLocationIcon()}>
                    <Popup>You are here</Popup>
                </Marker>
            )}
        </>
    );
};

// --- MOCK TRAFFIC DATA ---
const trafficData = [
    { time: '10am', flow: 40 }, { time: '12pm', flow: 70 },
    { time: '2pm', flow: 50 }, { time: '4pm', flow: 90 },
    { time: '6pm', flow: 85 }, { time: '8pm', flow: 30 },
];

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const [weather, setWeather] = useState({ temp: '--', aqi: '--', aqiStatus: 'Loading...' });
    const [locationName, setLocationName] = useState('Detecting City...');

    useEffect(() => {
        fetchAllData();
        fetchRealWeather(); 
    }, []);

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem('access');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const userRes = await api.get('user/profile/', config);
            setUser(userRes.data);

            const reportRes = await api.get('reports/', config);
            setReports(reportRes.data);

            try {
                const lbRes = await api.get('leaderboard/', config);
                setLeaderboard(lbRes.data.slice(0, 3)); 
            } catch (e) { console.warn("Leaderboard fetch failed", e); }

        } catch (error) {
            console.error("Dashboard Load Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRealWeather = () => {
        if (!navigator.geolocation) {
            setLocationName("Geolocation Not Supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
                const geoRes = await axios.get(geoUrl);
                const city = geoRes.data.city || geoRes.data.locality || geoRes.data.principalSubdivision || "Unknown Location";
                setLocationName(city);

                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
                const weatherRes = await axios.get(weatherUrl);
                const currentTemp = weatherRes.data.current_weather.temperature;
                
                const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;
                const aqiRes = await axios.get(aqiUrl);
                const currentAqi = aqiRes.data.current.us_aqi;

                let status = "Good";
                if (currentAqi > 50) status = "Moderate";
                if (currentAqi > 100) status = "Unhealthy";
                if (currentAqi > 150) status = "Hazardous";

                setWeather({
                    temp: Math.round(currentTemp),
                    aqi: currentAqi,
                    aqiStatus: status,
                });

            } catch (error) {
                console.error("Weather/Geo API Error:", error);
                setLocationName("Offline (Noida)");
                setWeather({ temp: 28, aqi: 65, aqiStatus: "Moderate (Est.)" });
            }
        }, (error) => {
            console.error("Location Access Denied:", error);
            setLocationName("Location Denied");
            setWeather({ temp: 28, aqi: 65, aqiStatus: "Moderate (Est.)" });
        });
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/300?text=No+Image";
        if (imagePath.startsWith('http')) return imagePath;
        return `http://127.0.0.1:8000${imagePath}`;
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'resolved': return '#00d68f'; 
            case 'verified': return '#007bff'; 
            default: return '#ffb547';         
        }
    };

    const getAqiColor = (aqi) => {
        if (aqi <= 50) return '#00d68f'; 
        if (aqi <= 100) return '#ffb547'; 
        if (aqi <= 150) return '#ff7b00'; 
        return '#ff3b3b'; 
    };

    if (loading) return <div style={{color: 'white', padding: 40}}>Loading Command Center...</div>;

    return (
        <div className="dashboard-grid">
            
            <style>
                {`
                    .user-location-marker { background: transparent; border: none; }
                    .location-circle { width: 14px; height: 14px; background-color: #4285F4; border: 2px solid white; border-radius: 50%; position: absolute; top: 3px; left: 3px; z-index: 2; box-shadow: 0 0 5px rgba(0,0,0,0.3); }
                    .location-pulse { width: 100%; height: 100%; background-color: rgba(66, 133, 244, 0.4); border-radius: 50%; position: absolute; top: 0; left: 0; animation: pulse 2s infinite; z-index: 1; }
                    @keyframes pulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
                `}
            </style>

            {/* === LEFT COLUMN === */}
            <div className="main-content">
                <div className="map-section">
                    <div style={{position: 'absolute', top: 20, left: 20, zIndex: 999}}>
                        <h2 style={{margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)', color: 'white'}}>
                            Command Center
                        </h2>
                        <span style={{color: '#00d68f', fontSize: '0.9rem', fontWeight: 'bold'}}>
                            ● Live Monitoring
                        </span>
                    </div>
                    
                    <MapContainer 
                        center={[28.4744, 77.5040]} 
                        zoom={13} 
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false} 
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        
                        <ZoomControl position="bottomright" />
                        <LocateControl />
                        <TrafficHeatmap reports={reports} />
                        
                        {/* THIS SECTION USES THE NEW DYNAMIC PINS */}
                        {reports.map((report) => (
                            <Marker 
                                key={report.id} 
                                position={[28.4744 + (Math.random() * 0.005), 77.5040 + (Math.random() * 0.005)]}
                                icon={getMarkerIcon(report.status)} // <--- USING DYNAMIC ICON HERE
                            >
                                <Popup>
                                    <strong>{report.title}</strong><br/>
                                    <span style={{color: getStatusColor(report.status), fontWeight: 'bold'}}>
                                        {report.status.toUpperCase()}
                                    </span>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div>
                    <h3 style={{color: '#8b8d9d', marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
                        <span>Live Citizen Reports</span>
                        <span style={{fontSize: '0.8rem'}}>Total: {reports.length}</span>
                    </h3>
                    <div className="reports-section">
                        {reports.length === 0 ? <p style={{color: '#555'}}>No active reports.</p> : reports.map((report) => (
                            <div key={report.id} className="report-card-modern">
                                <div className="status-tag" style={{backgroundColor: getStatusColor(report.status)}}>
                                    {report.status}
                                </div>
                                <img 
                                    src={getImageUrl(report.image)} 
                                    alt="Report" 
                                    className="report-img-modern"
                                />
                                <h4 style={{margin: '10px 0 5px 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    {report.title}
                                </h4>
                                <div style={{display: 'flex', alignItems: 'center', color: '#8b8d9d', fontSize: '0.8rem'}}>
                                    <FiMapPin style={{marginRight: 5}}/> 
                                    {report.location || "Greater Noida"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* === RIGHT COLUMN === */}
            <div className="sidebar">
                <div className="sidebar-card">
                    <div className="profile-card-header">
                        <div className="profile-avatar">
                            <FiUser size={24} color="white" style={{margin: '13px'}}/> 
                        </div>
                        <div>
                            <h3 style={{margin: 0}}>{user ? user.username : "Guest"}</h3>
                            {user && <span style={{color: '#00d68f', fontSize: '0.8rem'}}>Verified Citizen</span>}
                        </div>
                    </div>
                    <button className="view-profile-btn" onClick={() => navigate('/user/profile')}>
                        View Profile
                    </button>
                </div>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
                        <span>Air Quality Index</span>
                        <FiWind color={getAqiColor(weather.aqi)}/>
                    </div>
                    <div className="aqi-container">
                        <div style={{
                            width: '120px', height: '60px', 
                            background: `linear-gradient(90deg, ${getAqiColor(weather.aqi)} 0%, #333 100%)`,
                            borderRadius: '100px 100px 0 0', margin: '0 auto', opacity: 0.9,
                            boxShadow: `0 0 20px ${getAqiColor(weather.aqi)}40`
                        }}></div>
                        
                        <div className="aqi-value" style={{color: getAqiColor(weather.aqi)}}>{weather.aqi}</div>
                        <div className="aqi-label">{weather.aqiStatus}</div>
                    </div>
                </div>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div>
                            <span style={{color: '#8b8d9d', fontSize: '0.9rem'}}>{locationName}</span>
                            <h2 style={{fontSize: '3rem', margin: '5px 0', fontWeight: 'bold'}}>
                                {weather.temp}°C
                            </h2>
                            <span style={{fontSize: '0.8rem', color: '#00d68f'}}>Live Weather</span>
                        </div>
                        <FiSun size={40} color="#ffb547" style={{filter: 'drop-shadow(0 0 10px rgba(255, 181, 71, 0.4))'}}/>
                    </div>
                </div>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                         <h4 style={{margin: 0}}>Top Contributors</h4>
                         <span style={{fontSize: '0.8rem', color: '#2970ff', cursor: 'pointer'}} onClick={() => navigate('/leaderboard')}>View All</span>
                    </div>
                    {leaderboard.length > 0 ? leaderboard.map((u, index) => (
                        <div key={index} className="leader-row">
                            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                <span className="leader-rank">#{index + 1}</span>
                                <span>{u.username}</span>
                            </div>
                            <span className="leader-xp">{u.points} XP</span>
                        </div>
                    )) : <p style={{color: '#555', fontSize: '0.8rem'}}>No data yet</p>}
                </div>

                <div className="sidebar-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
                        <span>Traffic Flow (Est.)</span>
                    </div>
                    <div style={{height: '100px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trafficData}>
                                <Line type="monotone" dataKey="flow" stroke="#2970ff" strokeWidth={3} dot={false} />
                                <XAxis dataKey="time" hide />
                                <Tooltip contentStyle={{backgroundColor: '#151621', border: 'none', color: '#fff'}}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/new-report')}
                    style={{
                        background: '#2970ff', color: 'white', border: 'none', 
                        padding: '15px', borderRadius: '12px', fontWeight: 'bold', 
                        cursor: 'pointer', fontSize: '1rem', width: '100%',
                        boxShadow: '0 4px 15px rgba(41, 112, 255, 0.4)'
                    }}
                >
                    + Report New Incident
                </button>
            </div>
        </div>
    );
};

export default Dashboard;