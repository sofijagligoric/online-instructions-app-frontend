import React, { useState } from "react";
import "./Resource.css";
import "../../App.css";
import { Menu, Dropdown, Button } from "antd";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Resource = ({ resource, currentUser, backgroundColor }) => {
  const isOwner = currentUser?.id === resource.authorId;
  const isAdmin = currentUser?.role === "admin";
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const canDelete = isOwner || isAdmin;

  const handleDelete = () => {
    alert("Resource deleted.");
  };

  const handleEdit = () => {
    alert("Edit resource.");
  };

  const handleReportSubmit = ({ advertId, reason, description }) => {
    // alert(`Advert ID: ${advertId}\nReason: ${reason}\nDescription: ${description || "N/A"}`);
    setReportVisible(false);
  };

  const menu = (
    <Menu>
      {isOwner && (
        <Menu.Item key="edit" icon={<EditOutlined />} onClick={handleEdit}>
          Edit
        </Menu.Item>
      )}
      {canDelete && (
        <Menu.Item
          key="delete"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        >
          Delete
        </Menu.Item>
      )}
      {!canDelete && (
        <Menu.Item
          key="report"
          icon={<FlagOutlined />}
          onClick={() => setReportVisible(true)}
        >
          Report
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="resource-card" style={{ backgroundColor }}>
      <div className="resource-header">
        <div className="resource-info">
          <p>{resource.date || "01.02.2025."}</p>
          <p>@{resource.authorUsername || "korisnik1"}</p>
        </div>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Button
            className="custom-dropdown-button"
            shape="circle"
            icon={<MoreOutlined />}
          />
        </Dropdown>
      </div>

      <div
        className={`resource-title ${showFullTitle ? "full" : ""}`}
        onClick={() => setShowFullTitle(!showFullTitle)}
        style={{ marginBottom: "10px" }}
      >
        <h3>{resource.title}</h3>
      </div>
      <Link to={`/login`} className="view-resource-link">
        View details <ArrowRightOutlined />
      </Link>

      <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={resource.id}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Resource;
