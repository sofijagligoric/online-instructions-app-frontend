import React, { useState } from "react";
import "./Advert.css";
import "../../App.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import reportsService from "../../services/report.service";
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
import ConfirmDeleteModal from "../../components/Confirmation/ConfirmDeleteModal";

const Advert = ({
  advert,
  currentUser,
  role,
  backgroundColor,
  instructor,
  onDelete,
  onEdit,
}) => {
  const isOwner = currentUser === advert.instructorId;
  const isAdmin = role === "Admin";
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const canDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    try {
      await advertsService.deleteAdvert(advert.id);
      if (onDelete) onDelete(advert.id);
    } catch (err) {
      console.error("Error deleting advert:", err);
    }
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEdit = (updatedAdvert) => {
    if (onEdit) onEdit(updatedAdvert); 
  };

  const handleReportSubmit = async ({ reason, description }) => {
  try {
    
    const reportDTO = {
      userId: currentUser,         
      violationTypeId: reason,
      description: description || null,
      timestamp: new Date().toISOString(), 
    };

    const reportResponse = await reportsService.addReport(reportDTO);
    const reportId = reportResponse.data.id; 

    const advertReportDTO = {
      reportId: reportId,
      advertId: advert.id, 
    };

    await reportsService.addAdvertReport(advertReportDTO);

    alert("Advert report submitted successfully.");
    setReportVisible(false);
  } catch (err) {
    console.error("Error submitting advert report:", err);
    alert("Failed to submit advert report.");
  }
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
          onClick={() => setIsDeleteModalVisible(true)}
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

       <ConfirmDeleteModal
            visible={isDeleteModalVisible}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalVisible(false)}
          />
    </div>
  );
};

export default Advert;
