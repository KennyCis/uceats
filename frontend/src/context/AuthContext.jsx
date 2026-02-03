import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initial localStorage 
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem("uceats_user");
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [errors, setErrors] = useState([]);

  // Save user to state and local storage
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

  // GOOGLE LOGIN LOGIC ---
  const loginWithGoogle = async (googleToken) => {
    try {
        // Send the Google token to our Backend
        const res = await axios.post("http://3.88.179.56:3000/api/google", { 
            token: googleToken 
        });
        
        // If backend accepts it, sign the user in
        signin(res.data);
    } catch (error) {
        console.error("Google Auth Error:", error);
        setErrors([error.response?.data?.message || "Google Login Failed"]);
        throw error; // Rethrow to handle UI changes in the component
    }
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        signin, 
        logout, 
        updateUser, 
        isAuthenticated, 
        loginWithGoogle, // Export the function
        errors 
    }}>
      {children}
    </AuthContext.Provider>
  );
};