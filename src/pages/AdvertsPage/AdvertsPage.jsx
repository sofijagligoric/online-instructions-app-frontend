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
const { Option } = Select;

const AdvertsPage = () => {
  const [adverts, setAdverts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isInstructor = currentUser?.role === "instructor";
  //   const colors = ["#e1f4fa", "#daeaf5", "#e6ecfa", "#d5e1e8"];
  const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];
  const [sortOption, setSortOption] = useState("name-asc");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const advertsPerPage = 10;

  const indexOfLastAdvert = currentPage * advertsPerPage;
  const indexOfFirstAdvert = indexOfLastAdvert - advertsPerPage;

  const canCreate = isInstructor;

  const handleCreate = () => {
    alert("Added.");
  };

  useEffect(() => {
    const mockCategories = ["Sport", "Edukacija", "Nekretnine", "Servisi"];
    const mockAdverts = [
      {
        id: 1,
        title: "Prodajem bicikl",
        description: "Skoro nov bicikl, malo vožen.",
        category: "Sport",
        date: "2025-02-25",
        authorId: 5,
      },
      {
        id: 2,
        title: "Dajem časove matematike",
        description: "Online časovi za srednjoškolce.",
        category: "Edukacija",
        date: "2024-02-05",
        authorId: 7,
      },
      {
        id: 3,
        title:
          "Etiam stan suscipit sem sit amet arcu sollicitudin elementum. Cras gravida rutrum libero ac aliquet. Nullam ut bibendum nisl, nec sagittis arcu. Curabitur at malesuada diam, in finibus lacus.",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae urna ex. Morbi ex dolor, accumsan sed pharetra finibus, tempus venenatis felis. Nulla neque arcu, aliquam quis sem eu, ullamcorper convallis libero. Nulla facilisi. Aliquam sed leo erat. Suspendisse hendrerit eget eros in condimentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur lobortis, arcu in pulvinar eleifend, justo leo laoreet mi, quis viverra nisi arcu sit amet nisi. Proin lacus leo, porta a metus vel, commodo commodo lectus.",
        category: "Nekretnine",
        date: "2025-01-05",
        authorId: 10,
      },
      {
        id: 4,
        title: "Izdajem stan",
        description: "Garsonjera u Boriku.",
        category: "Nekretnine",
        date: "2025-02-01",
        authorId: 10,
      },
    ];

    setCategories(mockCategories);
    setAdverts(mockAdverts);
    setCurrentUser({
      id: 5,
      role: "instructor",
    });
  }, []);

  const filteredAdverts = adverts.filter((a) => {
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(a.category);
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
      return new Date(b.date) - new Date(a.date);
    }
    if (sortOption === "date-old") {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  const currentAdverts = sortedAdverts.slice(
    indexOfFirstAdvert,
    indexOfLastAdvert
  );
  const totalPages = Math.ceil(sortedAdverts.length / advertsPerPage);

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
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </div>
        {canCreate && (
          <button className="create-button" onClick={handleCreate}>
            Create
          </button>
        )}
      </div>

      {currentAdverts.map((ad, index) => (
        <Advert
          key={ad.id}
          advert={ad}
          currentUser={{ id: 5, role: "instructor" }}
          backgroundColor={colors[index % colors.length]}
        />
      ))}

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
    </div>
  );
};

export default AdvertsPage;
