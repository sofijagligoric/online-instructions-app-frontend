import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import categoryService from "../../services/category.service";

const ResourceReportModal = ({ visible, resource, onCancel }) => {
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
    if (resource && categories.length > 0) {
      const cat = categories.find((c) => c.id === resource.categoryId);
      setCategoryName(cat ? cat.name : "Unknown");
    }
  }, [resource, categories]);

  const handleViewResource = () => {
    if (!resource?.path) return;

    const fileExtension = resource.path.split(".").pop().toLowerCase();
    const fileUrl = `http://localhost:8080/api/resource/download/${resource.path}`;

    if (fileExtension === "pdf") {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      title="Resource details"
      open={visible}
      centered
      onCancel={onCancel}
      className="custom-add-resource-modal"
      footer={[
        <button
          key="cancel"
          className="cancel-resource-button"
          onClick={onCancel}
        >
          Close
        </button>,
      ]}
    >
      {resource ? (
        <div className="resource-details">
          <p>
            <strong>Title:</strong> {resource.title}
          </p>
          <p>
            <strong>Category:</strong> {categoryName}
          </p>
          <p>
            <Link to={`/admin/users/${resource.userId}`}>See author</Link>
          </p>
          <p>
            <button
              className="view-resource-button"
              onClick={handleViewResource}
            >
              View file
            </button>
          </p>
        </div>
      ) : (
        <p>No resource selected</p>
      )}
    </Modal>
  );
};

export default ResourceReportModal;
