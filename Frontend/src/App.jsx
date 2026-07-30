import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import MainPage from './pages/PosMain'; 
const DashboardPlaceholder = () => (
  <div className="p-8 text-xl font-bold">Welcome to Main POS / Dashboard! (Protected Area)</div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />



        {/* Fallback 404 */}
        <Route path="*" element={<div className="p-8 text-xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;