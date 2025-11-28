import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; 
import Navbar from './components/Navbar'; 

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';


// ... imports
import Register from './pages/Register'; // <--- Import it

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar /> 
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* <--- Add Route */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-report" element={<CreateReport />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
export default App;