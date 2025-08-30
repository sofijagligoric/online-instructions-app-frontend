import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [active, setActive] = useState(false);

  const login = (user) => {
    if (!user) return;
    setIsLoggedIn(user.active);
    setRole(user.role);
    setUserId(user.userId);
    setActive(user.active);
    localStorage.setItem("token", user.token); // ako koristiš token
    console.log("Prijavljen userId:", user.userId, "role:", user.role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUserId(null);
    setActive(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userId, active, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);