import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import categoryService from "../../services/category.service";

const AdvertReportModal = ({ visible, advert, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategorys();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (advert && categories.length > 0) {
      const cat = categories.find((c) => c.id === advert.categoryId);
      setCategoryName(cat ? cat.name : "Unknown");
    }
  }, [advert, categories]);

  return (
    <Modal
      title="Advert details"
      open={visible}
      centered
      onCancel={onCancel} 
      className="custom-add-advert-modal"
      footer={[
        <button
          key="cancel"
          className="cancel-advert-button"
          onClick={onCancel}
        >
          Close
        </button>,
      ]}
    >
      {advert ? (
        <div className="advert-details">
          <p>
            <strong>Title:</strong> {advert.title}
          </p>
          <p>
            <strong>Category:</strong> {categoryName}
          </p>
          <p>
            <strong>Description:</strong> {advert.description || "No description"}
          </p>
          <p>
              <Link to={`/admin/users/${advert.instructorId}`}>See author</Link>
          </p>
        </div>
      ) : (
        <p>No advert selected</p>
      )}
    </Modal>
  );
};

export default AdvertReportModal;