import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Question from "../DiscusionPage/Question";
import Resource from "../ResourcesPage/Resource";
import Advert from "../AdvertsPage/Advert";
import "./ViewProfilePage.css";

const ViewProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
    const backgroundColor = location.state?.backgroundColor || "#4a6cac";

  const [userQuestions, setUserQuestions] = useState([]);
  const [userResources, setUserResources] = useState([]);
  const [userAdverts, setUserAdverts] = useState([]);
  const [activeTab, setActiveTab] = useState("questions");

  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const currentUser = { id: 5, role: "instructor" }; // primer trenutnog korisnika

  useEffect(() => {
    if (!user) {
      // fetch korisnika po ID-u ako nije prosleđen
      const mockUser = {
        id,
        firstName: "Ana",
        lastName: "Marić",
        username: "anamaric",
        email: "ana@example.com",
        type: "instructor",
        dateCreated: "2025-01-10",
        phone: "+38765123456",
        isActive: true,
      };
      setUser(mockUser);
    }

    // fetch pitanja, materijala, oglasa (ili mock)
    setUserQuestions([
      { id: 1, title: "Kako učiti React?", content: "..." },
      { id: 2, title: "State vs Props", content: "..." },
    ]);

    setUserResources([
      { id: 1, title: "React tutorial PDF" },
      { id: 2, title: "JavaScript cheat sheet" },
    ]);

    setUserAdverts([
      { id: 1, title: "React kurs - početni nivo" },
      { id: 2, title: "Angular kurs" },
    ]);
  }, [id, user]);

  if (!user) return <p>Loading...</p>;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar" style={{ backgroundColor }}>{initials}</div>
        <div className="profile-name">
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>@{user.username}</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="info-card">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Type:</strong> {user.type}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "-"}
            </p>
            <p>
              <strong>Date Joined:</strong> {user.dateCreated}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="profile-main">
          <div className="tabs">
            <button
              /* className="tab-button" */
                className={activeTab === "questions" ? "active" : ""}
              onClick={() => setActiveTab("questions")}
           /*    style={{
                backgroundColor:
                  activeTab === "questions" ? "#c78512" : "#f2a827",
              }} */
            >
              Questions ({userQuestions.length})
            </button>

            <button
               /* className="tab-button" */
              className={activeTab === "resources" ? "active" : ""}
              onClick={() => setActiveTab("resources")}
             /*  style={{
                backgroundColor:
                  activeTab === "resources" ? "#249415" : "#42d42f",
              }} */
            >
              Resources ({userResources.length})
            </button>

            {user.type === "instructor" && (
              <button
                 /* className="tab-button" */
                className={activeTab === "adverts" ? "active" : ""}
                onClick={() => setActiveTab("adverts")}
              /*   style={{
                  backgroundColor:
                    activeTab === "adverts" ? "#156594" : "#34a8eb",
                }} */
              >
                Adverts ({userAdverts.length})
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === "questions" &&
              userQuestions.map((q, index) => (
                <Question
                  key={q.id}
                  question={q}
                  currentUser={currentUser}
                  backgroundColor={colors[index % colors.length]}
                />
              ))}
            {activeTab === "resources" &&
              userResources.map((r, index) => (
                <Resource
                  key={r.id}
                  resource={r}
                  currentUser={currentUser}
                  backgroundColor={colors[index % colors.length]}
                />
              ))}
            {activeTab === "adverts" &&
              user.type === "instructor" &&
              userAdverts.map((a, index) => (
                <Advert
                  key={a.id}
                  advert={a}
                  currentUser={currentUser}
                  backgroundColor={colors[index % colors.length]}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
