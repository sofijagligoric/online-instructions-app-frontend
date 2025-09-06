import React from "react";
import "./Footer.css";

const Footer = ({ role }) => {
  const getPath = (path) => {
    if (role === "student") return `/student${path}`;
    if (role === "instructor") return `/instructor${path}`;
    if (role === "admin") return `/admin${path}`;
    return path;
  };

  return (
    <footer className="footer">
      <div className="footer-left">
        <img
          src="/logo-blue.png"
          alt="Online Instructions Logo"
          className="footer-logo-img"
        />
        <div className="branding">
          <h2 className="footer-title">
            Online Instructions<span className="tm">&trade;</span>
          </h2>
        </div>
      </div>

      <nav className="footer-center">
        <a
          href={role === "admin" ? "/admin/reports" : getPath("/home")}
          className="footer-link"
        >
          Home
        </a>
        <a href={getPath("/users")} className="footer-link">
          Users
        </a>
        <a href={getPath("/adverts")} className="footer-link">
          Adverts
        </a>
        <a href={getPath("/resources")} className="footer-link">
          Resources
        </a>
        <a href={getPath("/discussion")} className="footer-link">
          Discusion
        </a>
      </nav>
      <div className="footer-right">
        <h3>About Us</h3>
        <p className="about-text">
          Connecting students with expert tutors, collaborative study materials,
          and a community ready to answer your toughest questions.
        </p>
        <p className="contact-info">
          Contact info:{" "}
          <a href="mailto:info@onlineinstructions.com">
            info@onlineinstructions.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
