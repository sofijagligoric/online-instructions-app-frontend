import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Background1 from "../../utils/Background1";
import "./SignUpPage.css";
import { Select as AntSelect } from "antd";

import accountService from "../../services/account.service";
const { Option } = AntSelect;

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
  const [type, setType] = useState("Student");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

const handleSignUp = async (e) => {
  e.preventDefault();

  if (password.length < 6 || confirmPassword.length < 6) {
    alert("Password has to have at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords don't match.");
    return;
  }

  try {
    try {
      await accountService.checkUsername(username);
      alert("Username already exists, please choose another one.");
      return; 
    } catch (err) {
      if (err.response && err.response.status === 404) {
      } else {
        console.error("Error checking username:", err);
        alert("Something went wrong while checking username.");
        return;
      }
    }

    const payload = {
      account: {
        username: username,
        password: password,
        type: type,
        isActive: true,
      },
      user: {
        fName: firstName,
        lName: lastName,
        email: email,
        phone: phone || null,
      },
    };

    if (type === "Student") {
      await accountService.createStudent(payload);
    } else {
      await accountService.createInstructor(payload);
    }

    alert("Account successfully created!");
    navigate("/login");
  } catch (error) {
    console.error("Error during sign up:", error);
    alert("Failed to create account.");
  }
};
  return (
    <div className="signup-container">
      <Background1 />
      <div className="signup-card">
        <h1 className="gradient-title">Online Instructions</h1>
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <input
            type="firstName"
            placeholder="First name"
            className="signup-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="lastName"
            placeholder="Last name"
            className="signup-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="username"
            placeholder="Username"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
           <input
            type="tel"
            placeholder="Phone number"
            className="signup-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="signup-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
           <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="signup-select"
          >
            <option value="Instructor">Instructor</option>
            <option value="Student">Student</option>
          </select>

          <button type="submit" className="signup-button">
            Create account
          </button>
        </form>
        <div className="signup-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
