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
import advertsService from "../../services/adverts.service";

const ViewProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const backgroundColor = location.state?.backgroundColor || "#4a6cac";
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

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
  // const currentUser = { id: 5, role: "instructor" };
  const currentUser = { id: 7, role: "student" };
  const profileId = id || currentUser.id;

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await userService.getUserById(profileId);
      setUser(fetchedUser);
    };
    fetchUser();
  }, [profileId]);

  useEffect(() => {
    if (!user) return;
    setUserQuestions([
      {
        id: 2,
        title: "Koliko je 2+2?",
        category: "Edukacija",
        date: "2024-02-05",
        authorId: 7,
      },
      {
        id: 1,
        title: "Da li je plava bolja od zelene?",
        description: "Pomozite mi u izboru boje.",
        category: "Sport",
        date: "2025-02-25",
        authorId: 5,
      },
    ]);

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

   if(user.type === "instructor") {
  const fetchAdverts = async () => {
    try {
      const adverts = await advertsService.getAdvertsForInstructor(user.id);
      setUserAdverts(adverts); 
    } catch (err) {
      console.error("Error fetching adverts:", err);
    }
  };
  fetchAdverts();
}
  }, [user]);

  if (!user) return <p>Loading...</p>;

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const handleDeleteAccount = () => {
    if (window.confirm("Da li ste sigurni da želite obrisati ovaj nalog?")) {
      console.log("Nalog obrisan:", user.id);
      // pozvati API za brisanje
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

      {currentUser.id === user.id ? (
        <button
          className="user-profile-edit-button"
          onClick={() => setIsEditModalVisible(true)}
        >
          Edit Profile
        </button>
      ) : currentUser.role === "admin" ? (
        <button
          className="user-profile-delete-button"
          onClick={handleDeleteAccount}
        >
          Delete Account
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
            <ReviewsSection currentUser={currentUser} instructorId={user.id} />
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
                    currentUser={currentUser}
                    backgroundColor={colors[index % colors.length]}
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
                    currentUser={currentUser}
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
                    currentUser={currentUser}
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
    </div>
  );
};

export default ViewProfilePage;
