import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiCamera, FiRefreshCw } from 'react-icons/fi';

//1. SETUP RED INCIDENT PIN
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const RedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// 2. DRAGGABLE INCIDENT PIN 
const IncidentPin = ({ position, setPosition, setAddress }) => {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        dragend() {
            const marker = markerRef.current;
            if (marker != null) setPosition(marker.getLatLng());
        },
    }), [setPosition]);

    useMapEvents({
        click(e) { setPosition(e.latlng); },
    });

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={RedIcon}
        >
            <Popup>Incident Location (Drag me!)</Popup>
        </Marker>
    );
};

// 3. BLUE DOT
const UserLocationDot = ({ userLocation }) => {
    const map = useMap();

    useEffect(() => {
        if (userLocation) {
            map.setView(userLocation, 16);
        }
    }, [userLocation, map]);

    if (!userLocation) return null;

    return (
        <>
            <CircleMarker
                center={userLocation}
                radius={20}
                pathOptions={{ color: 'transparent', fillColor: '#2970ff', fillOpacity: 0.2 }}
            />
            <CircleMarker
                center={userLocation}
                radius={8}
                pathOptions={{ color: 'white', weight: 2, fillColor: '#2970ff', fillOpacity: 1 }}
            >
                <Popup>You are here</Popup>
            </CircleMarker>
        </>
    );
};

const NewReport = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Pothole');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Location State
    const [gpsStatus, setGpsStatus] = useState("Waiting for GPS...");
    const [position, setPosition] = useState({ lat: 26.8467, lng: 80.9462 });
    const [userLocation, setUserLocation] = useState(null);
    const [address, setAddress] = useState('');

    const getLocation = () => {
        setGpsStatus("Searching...");
        if (!navigator.geolocation) {
            setGpsStatus("GPS Not Supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const userPos = { lat: latitude, lng: longitude };

                setUserLocation(userPos);
                setPosition(userPos);
                setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                setGpsStatus(`Locked`);
            },
            (err) => {
                console.error("GPS Error:", err);
                setGpsStatus("GPS Failed");
                alert("Please enable Location Services.");
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        getLocation();
    }, []);

    // 5MB File Size Handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            alert("Image is too large! Please upload a photo smaller than 5MB.");
            e.target.value = null; // Resets the input so they can try again
            return;
        }

        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('location', address || "Pinned Location");
        formData.append('latitude', position.lat);
        formData.append('longitude', position.lng);
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('access');
            const response = await api.post('reports/', formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert(`Report Submitted!\nAI analysis Confidence: ${response.data.ai_confidence}%`);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to submit report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>Report Incident</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.group}>
                        <label style={styles.label}>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Deep Pothole"
                            style={styles.input}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* MAP SECTION */}
                    <div style={styles.group}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={styles.label}>Location</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: userLocation ? '#00d68f' : '#ffb547' }}>
                                    {gpsStatus}
                                </span>
                                <button type="button" onClick={getLocation} style={styles.retryBtn} disabled={loading}>
                                    <FiRefreshCw />
                                </button>
                            </div>
                        </div>

                        <div style={styles.mapContainer}>
                            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <UserLocationDot userLocation={userLocation} />
                                <IncidentPin position={position} setPosition={setPosition} setAddress={setAddress} />
                            </MapContainer>
                        </div>
                        <p style={{ color: '#00d68f', fontSize: '0.8rem', marginTop: '5px' }}>
                            Selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                        </p>
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={styles.input}
                            placeholder="Describe the issue..."
                            disabled={loading}
                        />
                    </div>

                    {/* EVIDENCE UPLOAD SECTION */}
                    <div style={styles.group}>
                        <label style={styles.label}><FiCamera /> Evidence</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ color: '#aaa' }}
                            disabled={loading}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#8b8d9d', marginTop: '4px' }}>
                            Max file size: 5MB (JPG/PNG)
                        </span>
                    </div>

                    <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0c15' },
    card: { width: '100%', maxWidth: '500px', backgroundColor: '#151621', padding: '25px', borderRadius: '15px', border: '1px solid #2a2b3d' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    group: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { color: '#8b8d9d', fontSize: '0.9rem' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #2a2b3d', backgroundColor: '#0b0c15', color: 'white', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
    mapContainer: { height: '250px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '2px solid #2970ff' },
    submitBtn: { padding: '15px', marginTop: '10px', backgroundColor: '#2970ff', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
    retryBtn: { background: 'none', border: '1px solid #444', color: 'white', borderRadius: '5px', cursor: 'pointer', padding: '5px' }
};

export default NewReport;