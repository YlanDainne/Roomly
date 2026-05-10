import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SavedHomesPage from './pages/SavedHomesPage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import MyContractsPage from './pages/MyContractsPage';
import { AuthProvider } from './context/AuthContext';
import { RentalDataProvider } from './context/RentalDataContext';
import { PublicOnlyRoute, RequireAuth } from './components/RouteGuards';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RentalDataProvider>
          <div className="app-container">
            <div className="bg-layer" />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
              <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/search-results" element={<SearchResultsPage />} />
                <Route path="/listing/:id" element={<ListingDetailsPage />} />
                <Route path="/saved-homes" element={<SavedHomesPage />} />
                <Route path="/my-contracts" element={<MyContractsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </RentalDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
