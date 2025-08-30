import React, { useState } from "react";
import Background1 from "../../utils/Background1";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";
import ForgotPasswordModal from "./ForgotPasswordModal";
import authService from "../../services/auth.service";
import { useAuth } from "../../components/AuthContext/AuthContext";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
   const [isForgotModalVisible, setIsForgotModalVisible] = useState(false); 
    const { login } = useAuth();
      const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault(); // sprječava refresh stranice
    try {
      const credentials = { username, password };
      const response = await authService.login(credentials);

      if (!response.active) {
        alert("Vaš nalog je deaktiviran. Prijava nije moguća.");
        return;
      }

      // Postavljanje user-a u AuthContext
      login(response);

      // Redirect po role-u
      switch (response.role) {
        case "Instructor":
          navigate("/instructor/home");
          break;
        case "Admin":
          navigate("/admin/home");
          break;
        default:
          navigate("/student/home");
      }

    } catch (error) {
      console.error("Greška pri loginu:", error);
      if (error.response) {
        alert(
          error.response.data?.message || 
          typeof error.response.data === "string" 
            ? error.response.data 
            : "Greška pri loginu sa servera."
        );
      } else {
        alert("Greška pri loginu: " + error.message);
      }
    }
  };


  return (
    <div className="login-container">
      <Background1 />
      <div className="login-card">
         <h1 className="gradient-title">Online Instructions</h1>
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input type="username" placeholder="Username" className="login-input"  value={username}
            onChange={(e) => setUsername(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      <div className="login-links">
          <p>
            Forgot{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotModalVisible(true); }}>
              Password?
            </a>
          </p>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>

      {/* MODAL */}
      <ForgotPasswordModal
        visible={isForgotModalVisible}
        onCancel={() => setIsForgotModalVisible(false)}
      />
    </div>
  );
};

export default LoginPage;
