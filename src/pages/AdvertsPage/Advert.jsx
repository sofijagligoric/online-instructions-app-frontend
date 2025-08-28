import React, { useState } from "react";
import "./Advert.css";
import "../../App.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import { Menu, Dropdown, Button } from "antd";
import { formatDateTime } from "../../utils/formatDateTime";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import advertsService from "../../services/adverts.service";
import EditAdvertModal from "./EditAdvertModal";

const Advert = ({
  advert,
  currentUser,
  backgroundColor,
  instructor,
  onDelete,
  onEdit,
}) => {
  const isOwner = currentUser?.id === advert.instructorId;
  const isAdmin = currentUser?.role === "admin";
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const canDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    try {
      await advertsService.deleteAdvert(advert.id);
      alert("Advert deleted.");
      if (onDelete) onDelete(advert.id);
    } catch (err) {
      console.error("Error deleting advert:", err);
      alert("Failed to delete advert.");
    }
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEdit = (updatedAdvert) => {
    if (onEdit) onEdit(updatedAdvert); // parent će update-ovati listu
  };

  const handleReportSubmit = ({ advertId, reason, description }) => {
    // alert(`Advert ID: ${advertId}\nReason: ${reason}\nDescription: ${description || "N/A"}`);
    setReportVisible(false);
  };

  const menu = (
    <Menu>
      {isOwner && (
        <Menu.Item key="edit" icon={<EditOutlined />} onClick={handleEditClick}>
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
          <p>{formatDateTime(advert.timestamp)}</p>
          <p>@{instructor?.username || "N/A"}</p>
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
        <p>
          <i>Contact: </i>
        </p>
        <p>email - {instructor?.email || "N/A"},</p>
        <p>phone - {instructor?.phone || "N/A"}</p>
      </div>
      <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={advert.id}
        onSubmit={handleReportSubmit}
      />

      <EditAdvertModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onEdit={handleEdit}
        advert={advert}
      />
    </div>
  );
};

export default Advert;
