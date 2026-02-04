import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("uceats_user");
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [errors, setErrors] = useState([]);

  const signin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("uceats_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setErrors([]);
    localStorage.removeItem("uceats_user");
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("uceats_user", JSON.stringify(newUserData));
  };

  const loginWithGoogle = async (googleToken) => {
    try {
        const res = await axios.post(
            "http://3.227.144.60:3000/api/google", 
            { token: googleToken },
            { withCredentials: true }
        );
        
        signin(res.data);
    } catch (error) {
        console.error("Google Auth Error:", error);
        setErrors([error.response?.data?.message || "Google Login Failed"]);
        throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        signin, 
        logout, 
        updateUser, 
        isAuthenticated, 
        loginWithGoogle, 
        errors 
    }}>
      {children}
    </AuthContext.Provider>
  );
};