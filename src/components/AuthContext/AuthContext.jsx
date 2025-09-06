import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setIsLoggedIn(true);
        setRole(savedUser.role);
        setUserId(savedUser.userId);
        setActive(savedUser.active);
      }
    }
  }, []);

  const login = (user) => {
    if (!user) return;
    if (!user.token) {
      console.error("Nema tokena u user objektu:", user);
      return;
    }
    setIsLoggedIn(user.active);
    setRole(user.role);
    setUserId(user.userId);
    setActive(user.active);
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("Prijavljen userId:", user.userId, "role:", user.role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUserId(null);
    setActive(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, userId, active, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
