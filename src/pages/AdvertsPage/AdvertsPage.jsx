import React, { useEffect, useState } from "react";
import Advert from "./Advert";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./AdvertsPage.css";
import "../../App.css";
import { Select } from "antd";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import advertsService from "../../services/adverts.service";
import categoryService from "../../services/category.service";
import userService from "../../services/user.service";
import { useAuth } from "../../components/AuthContext/AuthContext";
import AddAdvertModal from "./AddAdvertModal";
const { Option } = Select;

const AdvertsPage = () => {
  const [adverts, setAdverts] = useState([]);
  const { userId, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const isInstructor = role === "Instructor";
  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const [sortOption, setSortOption] = useState("name-asc");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const advertsPerPage = 10;

  const indexOfLastAdvert = currentPage * advertsPerPage;
  const indexOfFirstAdvert = indexOfLastAdvert - advertsPerPage;

  const canCreate = isInstructor;
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [instructors, setInstructors] = useState({});

  const handleAddAdvert = (newAdvert) => {
    setAdverts((prevAdverts) => [newAdvert, ...prevAdverts]);
    setIsAddModalVisible(false);
  };
  useEffect(() => {
    const fetchAdverts = async () => {
      try {
        const response = await advertsService.getAllAdverts();
        setAdverts(response.data);
      } catch (err) {
        console.error("Error fetching adverts:", err);
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

    const fetchInstructors = async () => {
      try {
        const instructorsList = await userService.getAllInstructors();
        const instructorsMap = instructorsList.reduce((acc, instructor) => {
          if (!instructor) return acc;
          acc[instructor.id] = instructor;
          return acc;
        }, {});
        setInstructors(instructorsMap);
      } catch (err) {
        console.error("Error fetching instructors:", err);
      }
    };

    fetchAdverts();
    fetchCategories();
    fetchInstructors();
  }, []);

  const filteredAdverts = adverts.filter((a) => {
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(a.categoryId);
    return matchSearch && matchCategory;
  });

  const sortedAdverts = [...filteredAdverts].sort((a, b) => {
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

  const currentAdverts = sortedAdverts.slice(
    indexOfFirstAdvert,
    indexOfLastAdvert
  );
  const totalPages = Math.ceil(sortedAdverts.length / advertsPerPage);

  const handleDeleteAdvert = (id) => {
    setAdverts((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleUpdateAdvert = (updatedAdvert) => {
    setAdverts((prev) =>
      prev.map((ad) => (ad.id === updatedAdvert.id ? updatedAdvert : ad))
    );
  };

  return (
    <div className="adverts-main-div">
      <div className="adverts-title-and-search">
        <h1 className="adverts-title">Find your perfect tutor!</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="adverts-sort-add-div">
        <div className="adverts-sort-filter-div">
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
            Add advert
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

      {currentAdverts.map((ad, index) => (
        <Advert
          key={ad.id}
          advert={ad}
          currentUser={userId}
          role={role}
          backgroundColor={colors[index % colors.length]}
          instructor={instructors[ad.instructorId]}
          onDelete={handleDeleteAdvert}
          onEdit={handleUpdateAdvert}
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

      <AddAdvertModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onAdd={handleAddAdvert}
      />
    </div>
  );
};

export default AdvertsPage;
