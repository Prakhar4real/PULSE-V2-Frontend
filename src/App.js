import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewReport from './pages/NewReport';
import UserProfile from './pages/UserProfile';


import Missions from './pages/Missions'; 
import Community from './pages/Community'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app-container" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0b0c15'}}>
        
        
        <Navbar />

        <div style={{ flex: 1 }}>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-report" element={<NewReport />} />
                <Route path="/user/profile" element={<UserProfile />} />
                
                
                <Route path="/missions" element={<Missions />} />
                <Route path="/community" element={<Community />} />
            </Routes>
        </div>
        
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;