import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePageStyle.css";

const InstructorHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page-main">
      <div className="home-page-info">
        <h1 style={{ fontStyle: "italic" }}>
          "Empowering Knowledge, Inspiring Growth."
        </h1>
        <p>
          Our vision is to build a lively community where learning, teaching,
          and sharing resources spark creativity and growth.
        </p>
      </div>

      <div className="home-page-adverts">
        <div className="text-block">
          <h2>✨ Share Opportunities ✨</h2>
          <p>Publish personal adverts and give others new opportunities.</p>
        </div>
        <button onClick={() => navigate("/instructor/adverts")}>
          Explore Adverts
        </button>
      </div>

      <div className="home-page-resources">
        <div className="text-block">
          <h2>📚 Access Resources 📚</h2>
          <p>Browse helpful study materials and tools for your success.</p>
        </div>
        <button onClick={() => navigate("/instructor/resources")}>
          Explore Resources
        </button>
      </div>

      <div className="home-page-forum">
        <div className="text-block">
          <h2>💬 Join the Forum 💬</h2>
          <p>Ask questions, share answers, and grow with the community.</p>
        </div>
        <button onClick={() => navigate("/instructor/discussion")}>
          Visit Forum
        </button>
      </div>
    </div>
  );
};

export default InstructorHomePage;
