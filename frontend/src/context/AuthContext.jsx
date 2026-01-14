import { createContext, useState, useContext, useEffect } from "react";

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

  //save user
  const signin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("uceats_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("uceats_user");
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("uceats_user", JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider value={{ user, signin, logout, updateUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};