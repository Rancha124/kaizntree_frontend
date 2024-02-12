import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import SignUpComponent from './SignUp'; // Adjust the import path as necessary
import DashboardComponent from './DashboardComponent'; // Import your dashboard component
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignUpComponent />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
