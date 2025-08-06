import React, { useEffect, useState } from "react";
import Advert from "./Advert";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./AdvertsPage.css";

const AdvertsPage = () => {
  const [adverts, setAdverts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isInstructor = currentUser?.role === "instructor";
//   const colors = ["#e1f4fa", "#daeaf5", "#e6ecfa", "#d5e1e8"];
const colors = ["#fcf0d9", "#fcfbd9", "#e3fcd9", "#e3eefc"];

  const canCreate = isInstructor;

  const handleCreate = () => {
    alert("Added.");
  };

  useEffect(() => {
    const mockAdverts = [
      {
        id: 1,
        title: "Prodajem bicikl",
        description: "Skoro nov bicikl, malo vožen.",
        authorId: 5,
      },
      {
        id: 2,
        title: "Dajem časove matematike",
        description: "Online časovi za srednjoškolce.",
        authorId: 7,
      },
      {
        id: 3,
        title: "Izdajem stan",
        description: "Garsonjera u centru grada.",
        authorId: 10,
      },
      {
        id: 4,
        title: "Izdajem stan",
        description: "Garsonjera u Boriku.",
        authorId: 10,
      },
    ];

    setAdverts(mockAdverts);
    setCurrentUser({
      id: 5,
      role: "instructor",
    });
  }, []);

  const filteredAdverts = adverts.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="adverts-main-div">
      <div className="adverts-title-and-search">
        <h1 className="adverts-title">Find your perfect tutor!</h1>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      {canCreate && <button className="create-button"  onClick={handleCreate}>Create</button>}
      {filteredAdverts.map((ad, index) => (
        <Advert
          key={ad.id}
          advert={ad}
          currentUser={{ id: 5, role: "instructor" }}
          backgroundColor={colors[index % colors.length]}
        />
      ))}
    </div>
  );
};

export default AdvertsPage;
