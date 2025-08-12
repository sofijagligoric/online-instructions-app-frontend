import React, { useState } from "react";
import "./Advert.css";
import "../../App.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import { Menu, Dropdown, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const Advert = ({ advert, currentUser, backgroundColor }) => {
  const isOwner = currentUser?.id === advert.authorId;
  const isAdmin = currentUser?.role === "admin";
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const canDelete = isOwner || isAdmin;

  const handleDelete = () => {
    alert("Advert deleted.");
  };

  const handleEdit = () => {
    alert("Edit advert.");
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
    <div className="advert-card" style={{ backgroundColor }}>
      <div className="advert-header">
        <div className="advert-info">
          <p>{advert.date || "01.02.2025."}</p>
          <p>@{advert.authorUsername || "korisnik1"}</p>
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
        className={`advert-title ${showFullTitle ? "full" : ""}`}
        onClick={() => setShowFullTitle(!showFullTitle)}
      >
        <h3>{advert.title}</h3>
      </div>

      <div
        className={`advert-description ${showFullDesc ? "full" : ""}`}
        onClick={() => setShowFullDesc(!showFullDesc)}
      >
        <p>{advert.description}</p>
      </div>

      <div className="advert-contact-info">
        <p>Contact:</p>
        <p>{advert.contact || "065/821-158"}</p>
      </div>
        <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={advert.id}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Advert;
