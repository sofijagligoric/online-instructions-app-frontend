import React, { useEffect, useState } from "react";
import User from "./User";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./UsersPage.css";
import "../../App.css";
import usersService from "../../services/user.service";
import { Select } from "antd";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
const { Option } = Select;

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const colors = [
    "#e6b557",
    "#f2ee61",
    "#7ffa4d",
    "#7cb0f2",
    "#f2564e",
    "#f768df",
  ];
  const [sortOption, setSortOption] = useState("name-asc");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const mockCategories = ["Instructors", "Students"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await usersService.getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    setCategories(mockCategories);
  }, []);

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName} ${u.username}`.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(
        u.type === "student" ? "Students" : "Instructors"
      );

    const matchActive = u.isActive === true;

    return matchSearch && matchCategory && matchActive;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.firstName.localeCompare(b.firstName);
    }
    if (sortOption === "name-desc") {
      return b.firstName.localeCompare(a.firstName);
    }
    if (sortOption === "date-new") {
      return new Date(b.dateCreated) - new Date(a.dateCreated);
    }
    if (sortOption === "date-old") {
      return new Date(a.dateCreated) - new Date(b.dateCreated);
    }
    return 0;
  });
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  return (
    <div className="users-main-div">
      <div className="users-title-and-search">
        <h1 className="users-title">Connect with others.</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className="users-sort-add-div">
        <div className="users-sort-filter-div">
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

      <div className="users-list">
        {currentUsers.map((user, index) => (
          <User
            key={user.id}
            user={user}
            currentUser={currentUser}
            backgroundColor={colors[index % colors.length]}
          />
        ))}
      </div>

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

export default UsersPage;
