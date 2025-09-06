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
import resourceService from "../../services/resource.service";
import categoryService from "../../services/category.service";
import userService from "../../services/user.service";
const { Option } = Select;

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const { userId, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const isInstructor = role === "Instructor";
  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const [users, setUsers] = useState({});
  const [sortOption, setSortOption] = useState("name-asc");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 10;

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;

  const canCreate = isInstructor || role === "Student";

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleAddResource = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
    setIsAddModalVisible(false);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await resourceService.getAllResources();
        setResources(response.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
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
          if (!instructor) return acc;
          acc[instructor.id] = instructor;
          return acc;
        }, {});
        setUsers(usersMap);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchResources();
    fetchCategories();
    fetchUsers();
  }, []);

  const filteredResources = resources.filter((a) => {
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(a.categoryId);
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
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (sortOption === "date-old") {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
    return 0;
  });

  const currentResources = sortedResources.slice(
    indexOfFirstResource,
    indexOfLastResource
  );
  const totalPages = Math.ceil(sortedResources.length / resourcesPerPage);

  const handleDeleteResource = (id) => {
    setResources((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleUpdateResource = (updatedResource) => {
    setResources((prev) =>
      prev.map((ad) => (ad.id === updatedResource.id ? updatedResource : ad))
    );
  };

  return (
    <div className="resources-main-div">
      <div className="resources-title-and-search">
        <h1 className="resources-title">Post. Share. Inspire.</h1>
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
            maxTagCount={0}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </div>

        {canCreate && (
          <button
            className="create-button"
            onClick={() => setIsAddModalVisible(true)}
          >
            Add resource
          </button>
        )}
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
      {currentResources.map((ad, index) => (
        <Resource
          key={ad.id}
          resource={ad}
          userName={users[ad.userId]?.username}
          currentUser={userId}
          role={role}
          backgroundColor={colors[index % colors.length]}
          onDelete={handleDeleteResource}
          onEdit={handleUpdateResource}
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
