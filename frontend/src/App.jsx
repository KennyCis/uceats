import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import ClientOrdersPage from "./pages/ClientOrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

import logo from "./assets/logo-uceats.png";
import "./App.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function AuthPage() {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <img src={logo} alt="UCEats Logo" className="logo" style={{ width: "250px", marginBottom: "20px" }} />
        
        <p className="welcome-text">Welcome to the best university bar</p>

        <div className="tabs">
          <button
            className={`tab-btn ${activeForm === "login" ? "active" : ""}`}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeForm === "register" ? "active" : ""}`}
            onClick={() => setActiveForm("register")}
          >
            Register
          </button>
        </div>

        {activeForm === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
}

// Internal component to handle routing logic with context access
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected Routes (Any logged-in user) */}
      <Route element={<ProtectedRoute isAllowed={!!user} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-orders" element={<ClientOrdersPage />} />
      </Route>

      {/* Admin Routes (Only admin role) */}
      <Route element={<ProtectedRoute isAllowed={!!user && user.role === 'admin'} redirectTo="/home" />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
           {/* Render routes inside providers */}
           <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;