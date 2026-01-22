import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; 
import NoticeBoard from './pages/NoticeBoard';

// Components
import Navbar from './components/Navbar'; 
import ChatWidget from './components/ChatWidget';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions'; 
import Leaderboard from './pages/Leaderboard';



import NewReport from './pages/NewReport'; 


function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notices" element={<NoticeBoard />} />
            
            
            <Route path="/new-report" element={<NewReport />} /> 
            
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/missions" element={<Missions />} />
          </Routes>
          <ChatWidget />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;