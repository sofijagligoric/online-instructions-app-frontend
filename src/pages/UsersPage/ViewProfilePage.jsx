import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Question from "../DiscusionPage/Question";
import Resource from "../ResourcesPage/Resource";
import Advert from "../AdvertsPage/Advert";
import "./ViewProfilePage.css";
import ReviewsSection from "./ReviewsSection";
import EditProfileModal from "./EditProfileModal";
import userService from "../../services/user.service";
import reviewService from "../../services/review.service";
import accountService from "../../services/account.service";
import ChangePasswordModal from "../../components/ChangePassword/ChangePasswordModal";
import { useAuth } from "../../components/AuthContext/AuthContext";
import advertsService from "../../services/adverts.service";
import threadService from "../../services/thread.service";

const ViewProfilePage = () => {
  const { id } = useParams();
  const { userId, role } = useAuth();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const backgroundColor = location.state?.backgroundColor || "#4a6cac";
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);

  const [userQuestions, setUserQuestions] = useState([]);
  const [userResources, setUserResources] = useState([]);
  const [userAdverts, setUserAdverts] = useState([]);
  const [activeTab, setActiveTab] = useState("questions");
  // const [reviews, setReviews] = useState([]);

  const [questionPage, setQuestionPage] = useState(1);
  const questionsPerPage = 10;
  const totalQuestionPages = Math.ceil(userQuestions.length / questionsPerPage);

  const currentQuestions = userQuestions.slice(
    (questionPage - 1) * questionsPerPage,
    questionPage * questionsPerPage
  );

  const [resourcePage, setResourcePage] = useState(1);
  const resourcesPerPage = 10;
  const totalResourcePages = Math.ceil(userResources.length / resourcesPerPage);

  const currentResources = userResources.slice(
    (resourcePage - 1) * resourcesPerPage,
    resourcePage * resourcesPerPage
  );

  const [advertPage, setAdvertPage] = useState(1);
  const advertsPerPage = 10;
  const totalAdvertPages = Math.ceil(userAdverts.length / advertsPerPage);

  const currentAdverts = userAdverts.slice(
    (advertPage - 1) * advertsPerPage,
    advertPage * advertsPerPage
  );

  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const profileId = id || userId;

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await userService.getUserById(profileId);
      setUser(fetchedUser);
    };
    fetchUser();
  }, [profileId]);

  useEffect(() => {
    if (!user) return;

    setUserResources([
      {
        id: 1,
        title: "Matematika 4 - zbirka rijesenih zadataka",
        category: "Edukacija",
        date: "2025-02-25",
        authorId: 5,
      },
      {
        id: 2,
        title: "Uvod u osnove programskog jezika Java",
        category: "Edukacija",
        date: "2024-02-05",
        authorId: 7,
      },
    ]);

    const fetchQuestions = async () => {
      try {
        const questions = await threadService.getDiscussionThreadsForUser(
          user.id
        );
        setUserQuestions(questions);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setUserQuestions([]);
        } else {
          console.error("Error fetching questions:", err);
        }
      }
    };
    fetchQuestions();

    if (user.type === "instructor") {
      const fetchAdverts = async () => {
        try {
          const adverts = await advertsService.getAdvertsForInstructor(user.id);
          setUserAdverts(adverts);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setUserAdverts([]);
          } else {
            console.error("Error fetching adverts:", err);
          }
        }
      };
      fetchAdverts();
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleToggleAccount = async () => {
    try {
      if (user.active) {
        await accountService.deactivateAccount(user.id);
        setUser((prev) => ({ ...prev, active: false }));
        alert("Nalog je deaktiviran.");
      } else {
        await accountService.activateAccount(user.id);
        setUser((prev) => ({ ...prev, active: true }));
        alert("Nalog je aktiviran.");
      }
    } catch (err) {
      console.error("Greška prilikom promjene statusa naloga:", err);
      alert("Neuspjela promjena statusa naloga.");
    }
  };

  const handleSaveProfile = (updatedData) => {
    console.log("Updated profile:", updatedData);
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const handleDeleteAdvert = (id) => {
    setUserAdverts((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleUpdateAdvert = (updatedAdvert) => {
    setUserAdverts((prev) =>
      prev.map((ad) => (ad.id === updatedAdvert.id ? updatedAdvert : ad))
    );
  };

  const handleDeleteQuestion = (id) => {
    setUserQuestions((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    setUserQuestions((prev) =>
      prev.map((ad) => (ad.id === updatedQuestion.id ? updatedQuestion : ad))
    );
  };
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar" style={{ backgroundColor }}>
          {initials}
        </div>
        <div className="profile-name">
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>@{user.username}</p>
        </div>
      </div>

      {userId === user.id ? (
        <div className="user-profile-options-div">
          <button
            className="user-profile-edit-button"
            onClick={() => setIsEditModalVisible(true)}
          >
            Edit Profile
          </button>

          <button
            className="user-profile-edit-button"
            onClick={() => setIsChangePasswordModalVisible(true)}
          >
            Change password
          </button>
        </div>
      ) : role === "Admin" ? (
        <button
          className={`user-profile-delete-button ${
            user.active ? "" : "green-button"
          }`}
          onClick={handleToggleAccount}
        >
          {user.active ? "Deactivate Account" : "Activate Account"}
        </button>
      ) : null}

      <div className="profile-content">
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

          {user.type === "instructor" && (
            <ReviewsSection currentUser={userId} instructorId={user.id} />
          )}
        </div>

        <div className="profile-main">
          <div className="tabs">
            <button
              className={activeTab === "questions" ? "active" : ""}
              onClick={() => setActiveTab("questions")}
            >
              Questions ({userQuestions.length})
            </button>

            <button
              className={activeTab === "resources" ? "active" : ""}
              onClick={() => setActiveTab("resources")}
            >
              Resources ({userResources.length})
            </button>

            {user.type === "instructor" && (
              <button
                className={activeTab === "adverts" ? "active" : ""}
                onClick={() => setActiveTab("adverts")}
              >
                Adverts ({userAdverts.length})
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === "questions" && (
              <>
                {currentQuestions.map((q, index) => (
                  <Question
                    key={q.id}
                    question={q}
                    currentUser={userId}
                    role={role}
                    userName={user.username}
                    backgroundColor={colors[index % colors.length]}
                    onDelete={handleDeleteQuestion}
                    onEdit={handleUpdateQuestion}
                  />
                ))}
                {totalQuestionPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setQuestionPage((p) => Math.max(p - 1, 1))}
                      disabled={questionPage === 1}
                    >
                      Back
                    </button>
                    <span>
                      Page {questionPage} of {totalQuestionPages}
                    </span>
                    <button
                      onClick={() =>
                        setQuestionPage((p) =>
                          Math.min(p + 1, totalQuestionPages)
                        )
                      }
                      disabled={questionPage === totalQuestionPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === "adverts" && (
              <>
                {currentAdverts.map((a, index) => (
                  <Advert
                    key={a.id}
                    advert={a}
                    currentUser={userId}
                    role={role}
                    backgroundColor={colors[index % colors.length]}
                    instructor={user}
                    onDelete={handleDeleteAdvert}
                    onEdit={handleUpdateAdvert}
                  />
                ))}
                {totalAdvertPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setAdvertPage((p) => Math.max(p - 1, 1))}
                      disabled={advertPage === 1}
                    >
                      Back
                    </button>
                    <span>
                      Page {advertPage} of {totalAdvertPages}
                    </span>
                    <button
                      onClick={() =>
                        setAdvertPage((p) => Math.min(p + 1, totalAdvertPages))
                      }
                      disabled={advertPage === totalAdvertPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === "resources" && (
              <>
                {currentResources.map((r, index) => (
                  <Resource
                    key={r.id}
                    resource={r}
                    currentUser={userId}
                    role={role}
                    backgroundColor={colors[index % colors.length]}
                  />
                ))}
                {totalResourcePages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setResourcePage((p) => Math.max(p - 1, 1))}
                      disabled={resourcePage === 1}
                    >
                      Back
                    </button>
                    <span>
                      Page {resourcePage} of {totalResourcePages}
                    </span>
                    <button
                      onClick={() =>
                        setResourcePage((p) =>
                          Math.min(p + 1, totalResourcePages)
                        )
                      }
                      disabled={resourcePage === totalResourcePages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <EditProfileModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSave={handleSaveProfile}
        user={user}
      />

      <ChangePasswordModal
        visible={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        userId={user.id}
      />
    </div>
  );
};

export default ViewProfilePage;
