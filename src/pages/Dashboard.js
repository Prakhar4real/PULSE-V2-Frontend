import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/MapView'; 
import WeatherWidget from '../components/WeatherWidget'; // Weather api

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('reports/');
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System Status: Online • {reports.length} Active Reports</p>
        </div>
        <div>
          <button 
            className="btn-primary"
            onClick={() => navigate('/new-report')}
          >
            + New Incident
          </button>
        </div>
      </div>

      {/* --- WEATHER WIDGET GOES HERE --- */}
      <WeatherWidget /> 
      {/* -------------------------------- */}

      {/* MAP */}
      <h3 style={{ marginBottom: '20px' }}>Live Feed</h3>
      <MapView reports={reports} />
      
      {/* REPORTS GRID */}
      <h3 style={{ marginTop: '50px', marginBottom: '20px' }}>Recent Activity</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {reports.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No active reports.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="card">
              
              {report.image && (
                <img 
                  src={report.image} 
                  alt="Evidence" 
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} 
                />
              )}

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{report.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>📍 {report.city}</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{report.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: '600',
                    backgroundColor: report.status === 'SOLVED' ? '#e6f4ea' : '#fff4e5',
                    color: report.status === 'SOLVED' ? '#137333' : '#b06000'
                }}>
                  {report.status}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  By: {report.username}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;