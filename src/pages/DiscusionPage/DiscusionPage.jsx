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
const { Option } = Select;

const DiscusionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isInstructor = currentUser?.role === "instructor";
  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const [sortOption, setSortOption] = useState("name-asc");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  const canCreate = isInstructor;

  const handleCreate = () => {
    alert("Added.");
  };

  useEffect(() => {
    const mockCategories = ["Sport", "Edukacija", "Nekretnine", "Servisi"];
    const mockQuestions = [
      {
        id: 1,
        title: "Da li je plava bolja od zelene?",
        description: "Pomozite mi u izboru boje.",
        category: "Sport",
        date: "2025-02-25",
        authorId: 5,
      },
      {
        id: 2,
        title: "Koliko je 2+2?",
        category: "Edukacija",
        date: "2024-02-05",
        authorId: 7,
      },
      {
        id: 4,
        title: "Koja je najbrza komponena zivotinja?",
        description: "Gepard ili crna mamba?.",
        category: "Edukacija",
        date: "2025-02-01",
        authorId: 10,
      },
    ];

    setCategories(mockCategories);
    setQuestions(mockQuestions);
    setCurrentUser({
      id: 5,
      role: "instructor",
    });
  }, []);

  const filteredQuestions = questions.filter((a) => {
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(a.category);
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

  return (
    <div className="discusion-main-div">
      <div className="discusion-title-and-search">
        <h1 className="discusion-title">
          Start a discussion. Share your knowledge.
        </h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="create-question-div ">
        {canCreate && <NewQuestion categories={categories} />}
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
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {currentQuestions.map((ad, index) => (
        <Question
          key={ad.id}
          question={ad}
          currentUser={{ id: 5, role: "instructor" }}
          backgroundColor={colors[index % colors.length]}
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
