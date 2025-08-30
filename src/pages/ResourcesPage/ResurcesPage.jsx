import React, { useEffect, useState } from "react";
import Resource from "./Resource";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./ResourcesPage.css";
import "../../App.css";
import AddResourceModal from "./AddResourceModal";
import { useAuth } from "../../components/AuthContext/AuthContext";
import { Select } from "antd";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
   const { userId, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const isInstructor = role === "Instructor";
  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const [sortOption, setSortOption] = useState("name-asc");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 10;

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;

  const canCreate = isInstructor;

   const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleAddResource = (resource) => {
    console.log("New resource:", resource);
    setIsAddModalVisible(false);
  };

  useEffect(() => {
    const mockCategories = ["Sport", "Edukacija", "Nekretnine", "Servisi"];
    const mockResources = [
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
      {
        id: 4,
        title: "Skripta iz predmeta Mobilno racunarstvo",
        category: "Edukacija",
        date: "2025-02-01",
        authorId: 10,
      },
    ];

    setCategories(mockCategories);
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter((a) => {
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(a.category);
    return matchSearch && matchCategory;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
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

  const currentResources = sortedResources.slice(
    indexOfFirstResource,
    indexOfLastResource
  );
  const totalPages = Math.ceil(sortedResources.length / resourcesPerPage);

  return (
    <div className="resources-main-div">
      <div className="resources-title-and-search">
        <h1 className="resources-title">
          Post. Share. Inspire.
        </h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="resources-sort-add-div">
        <div className="resources-sort-filter-div">
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

          {canCreate && (
          <button className="create-button"  onClick={() => setIsAddModalVisible(true)}>
            Add resource
          </button>
        )}
      </div>

      {currentResources.map((ad, index) => (
        <Resource
          key={ad.id}
          resource={ad}
          currentUser={userId}
          role={role}
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

        <AddResourceModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onAdd={handleAddResource}
      />
    </div>
  );
};

export default ResourcesPage;
