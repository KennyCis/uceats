import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 1. Import Google Provider
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext"; 

// Replace this with your actual Google Client ID
const GOOGLE_CLIENT_ID = "271140556219-o3a0ua89t9pkn6smiqpe61k5mg550smq.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap everything with Google Provider */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);