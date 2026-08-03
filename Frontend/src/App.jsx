import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

// Protected Pages & Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import MainPage from "./pages/PosMain";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Cashier POS Terminal Route */}
        <Route
          path="/pos"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "CASHIER"]}>
              <MainPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-2">
                <h1 className="text-4xl font-black text-purple-600">404</h1>
                <p className="text-sm font-bold text-slate-700">
                  Page Not Found
                </p>
                <p className="text-xs text-slate-400">
                  The page you are looking for does not exist.
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
