import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // <--- Import the new page

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Change the Home route to point to Dashboard */}
          <Route path="/" element={<Dashboard />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;