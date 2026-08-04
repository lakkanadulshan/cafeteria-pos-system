import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import api from "./api/axios"; 

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import SetupWizard from "./pages/SetupWizard"; 

// Protected Pages & Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/admin/AdminDashboard";
import MainPage from "./pages/PosMain";
import Profile from "./pages/Profile";

function App() {
  const [isSetupRequired, setIsSetupRequired] = useState(null);

  useEffect(() => {
    api.get("/auth/setup-status")
      .then((res) => {
        setIsSetupRequired(res.data.isSetupRequired);
      })
      .catch((err) => {
        console.error("Setup status check error:", err);
        setIsSetupRequired(false); 
      });
  }, []);

  if (isSetupRequired === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-300">Checking Bloom Café System Status...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* First-Time Setup Wizard Route */}
        <Route
          path="/setup"
          element={
            isSetupRequired ? <SetupWizard /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/"
          element={isSetupRequired ? <Navigate to="/setup" replace /> : <Home />}
        />
        <Route
          path="/login"
          element={isSetupRequired ? <Navigate to="/setup" replace /> : <Login />}
        />
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