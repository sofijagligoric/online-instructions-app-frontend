import React from "react";
import { useNavigate } from "react-router-dom";

const HomePageTesting = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <img
        src="/logo-blue.png"
        alt="Logo"
        style={{ width: "150px", marginBottom: "24px" }}
      />
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
      <button
        onClick={() => navigate("/admin")}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Admin main layout
      </button>
      <button
        onClick={() => navigate("/instructor")}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Instructor main layout
      </button>
      <button
        onClick={() => navigate("/student")}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Student main layout
      </button>
    </div>
  );
};

export default HomePageTesting;
