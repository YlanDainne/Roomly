import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SavedHomesPage from './pages/SavedHomesPage';
import MyContractsPage from './pages/MyContractsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="bg-layer" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/saved-homes" element={<SavedHomesPage />} />
          <Route path="/my-contracts" element={<MyContractsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
