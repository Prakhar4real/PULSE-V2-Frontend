import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Missions from './pages/Missions'; 
import NewReport from './pages/NewReport'; 
import UserProfile from './pages/UserProfile'; 
import Documentation from './pages/Documentation';
import ReportIssue from './pages/ReportIssue';
import Community from './pages/Community'; 
import History from './pages/History';
import NoticeBoard from './pages/NoticeBoard';
// Components
import ChatWidget from './components/ChatWidget';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 

// --- LAYOUT HELPER ---
const Layout = ({ children }) => {
  const location = useLocation();
  
  
  const hideNavbarRoutes = ['/', '/login', '/register'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  
  const hideFooterRoutes = ['/', '/login', '/register', '/chat']; 
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      {showNavbar && <Navbar />} 
      
      {/* Global Chat Widget */}
      <ChatWidget />
      
      {/* Main Content (Grows to fill space) */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/new-report" element={<NewReport />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/docs/:type" element={<Documentation />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/history" element={<History />} />
          <Route path="/notices" element={<NoticeBoard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;