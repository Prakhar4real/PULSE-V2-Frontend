import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateReport = () => {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const getLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLoadingLocation(false);
        },
        (error) => {
          console.error(error);
          setLoadingLocation(false);
          alert("Could not retrieve location.");
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('city', city);
    formData.append('description', description);
    if (lat && lng) {
        formData.append('latitude', lat);
        formData.append('longitude', lng);
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      await api.post('reports/', formData);
      alert("Report Submitted Successfully");
      navigate('/'); 
    } catch (error) {
      alert("Failed to submit report.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', minHeight: '100vh' }}>
      
      <div className="card">
        <h2 style={{ marginBottom: '25px' }}>New Incident Report</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* TITLE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Large Pothole on Main St"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              required
            />
          </div>

          {/* CITY */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>City / Sector</label>
            <input 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              required
            />
          </div>

          {/* LOCATION BUTTON */}
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: 'var(--text-secondary)' }}>Location Data</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                    type="button"
                    onClick={getLocation}
                    className="btn-primary"
                    style={{ backgroundColor: lat ? '#34c759' : 'var(--accent)', fontSize: '0.9rem' }}
                    disabled={loadingLocation}
                >
                    {loadingLocation ? "Locating..." : lat ? "✓ Location Locked" : "📍 Auto-Detect Location"}
                </button>
                {lat && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lat.toFixed(4)}, {lng.toFixed(4)}</span>}
            </div>
          </div>

          {/* IMAGE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>Evidence Photo</label>
            <input 
              type="file" 
              onChange={handleImageChange}
              accept="image/*"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-secondary)' }}>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box', fontFamily: 'inherit' }}
              required
            />
          </div>

          {/* SUBMIT */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
                type="button" 
                onClick={() => navigate('/')}
                style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '500' }}
            >
                Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                Submit Report
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateReport;