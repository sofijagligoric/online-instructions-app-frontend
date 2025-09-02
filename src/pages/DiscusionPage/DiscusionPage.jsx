import React, { useEffect, useState } from "react";
import Question from "./Question";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./DiscusionPage.css";
import "../../App.css";
import { Select } from "antd";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import NewQuestion from "./NewQuestion";
import categoryService from "../../services/category.service";
import userService from "../../services/user.service";
import threadService from "../../services/thread.service";
import { useAuth } from "../../components/AuthContext/AuthContext";
const { Option } = Select;

const DiscusionPage = () => {
  const [questions, setQuestions] = useState([]);
  const { userId, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState({});
  const isInstructor = role === "Instructor";
  const isStudent = role === "Student";
  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const [sortOption, setSortOption] = useState("name-asc");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  const canCreate = isInstructor || isStudent;

  const handleCreate = async (newQuestion) => {
    try {
      const response = await threadService.addDiscussionThread(newQuestion);
      setQuestions((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error("Error creating question:", err);
      alert("Error while creating question.");
    }
  };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await threadService.getAllDiscussionThreads();
        setQuestions(response.data);
      } catch (err) {
        console.error("Error fetching threads:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategorys();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersList = await userService.getAllUsers();
        const usersMap = usersList.reduce((acc, instructor) => {
          if (!instructor) return acc; // skip null
          acc[instructor.id] = instructor;
          return acc;
        }, {});
        setUsers(usersMap);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchThreads();
    fetchCategories();
    fetchUsers();
  }, []);

  const filteredQuestions = questions.filter((a) => {
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(a.categoryId);
    return matchSearch && matchCategory;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "name-desc") {
      return b.title.localeCompare(a.title);
    }
    if (sortOption === "date-new") {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortOption === "date-old") {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  const currentQuestions = sortedQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  const totalPages = Math.ceil(sortedQuestions.length / questionsPerPage);

  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    setQuestions((prev) =>
      prev.map((ad) => (ad.id === updatedQuestion.id ? updatedQuestion : ad))
    );
  };

  return (
    <div className="discusion-main-div">
      <div className="discusion-title-and-search">
        <h1 className="discusion-title">
          Start a discussion. Share your knowledge.
        </h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="create-question-div ">
        {canCreate && (
          <NewQuestion categories={categories} onSubmit={handleCreate} />
        )}
      </div>
      <div className="discusion-sort-add-div">
        <div className="discusion-sort-filter-div">
          <Select
            value={sortOption}
            onChange={(value) => setSortOption(value)}
            suffixIcon={<SortAscendingOutlined />}
            className="custom-sort-select"
          >
            <Option value="name-asc">
              <SortAscendingOutlined /> Name A–Z
            </Option>
            <Option value="name-desc">
              <SortDescendingOutlined /> Name Z–A
            </Option>
            <Option value="date-new">
              <CalendarOutlined /> Newest first
            </Option>
            <Option value="date-old">
              <FieldTimeOutlined /> Oldest first
            </Option>
          </Select>

          <Select
            mode="multiple"
            allowClear
            placeholder="Select categories"
            value={selectedCategories}
            onChange={(value) => setSelectedCategories(value)}
            suffixIcon={<AppstoreOutlined />}
            className="custom-sort-select"
            maxTagCount={0}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <div className="selected-categories">
          {selectedCategories.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <span key={catId} className="category-tag">
                {cat?.name}
                <button
                  type="button"
                  className="remove-tag-btn"
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.filter((c) => c !== catId)
                    )
                  }
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {currentQuestions.map((ad, index) => (
        <Question
          key={ad.id}
          question={ad}
          currentUser={userId}
          role={role}
          userName={users[ad.userId]?.username}
          backgroundColor={colors[index % colors.length]}
          onDelete={handleDeleteQuestion}
          onEdit={handleUpdateQuestion}
        />
      ))}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Back
          </button>
          <span>
            Page {currentPage} out of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscusionPage;
