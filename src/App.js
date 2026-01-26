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

// Components
import ChatWidget from './components/ChatWidget';
import Navbar from './components/Navbar'; 

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/register'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />} 
      <ChatWidget />
      {children}
    </>
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;