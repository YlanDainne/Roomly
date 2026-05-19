import React, { useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SavedHomesPage from './pages/SavedHomesPage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import MyContractsPage from './pages/MyContractsPage';
import OpenContractPage from './pages/OpenContractPage';
import LandlordProposalsPage from './pages/LandlordProposalsPage';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthProvider } from './context/AuthContext';
import { RentalDataProvider } from './context/RentalDataContext';
import { PopupProvider } from './context/PopupContext';
import { PublicOnlyRoute, RequireAuth, AdminRoute } from './components/RouteGuards';
import Popup from './components/Popup';
import './App.css';
import './styles/dark-mode.css';

function App() {
  useEffect(() => {
    const isDark = localStorage.getItem('roomly-dark-mode') === 'true';
    if (isDark) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <Router>
      <PopupProvider>
        <AuthProvider>
          <RentalDataProvider>
            <div className="app-container">
              <div className="bg-layer" />
              <Popup />
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
                <Route path="/listing/:id/proposals" element={<LandlordProposalsPage />} />
                <Route path="/contract/:id" element={<OpenContractPage />} />
                <Route path="/saved-homes" element={<SavedHomesPage />} />
                <Route path="/my-contracts" element={<MyContractsPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Route>
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          </RentalDataProvider>
        </AuthProvider>
      </PopupProvider>
    </Router>
  );
}

export default App;
