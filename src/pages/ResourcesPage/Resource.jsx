import React, { useState } from "react";
import "./Resource.css";
import "../../App.css";
import { Menu, Dropdown, Button, Popconfirm } from "antd";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import reportsService from "../../services/report.service";
import resourceService from "../../services/resource.service";
import { formatDateTime } from "../../utils/formatDateTime";
import EditResourceModal from "./EditResourceModal";
import { Link } from "react-router-dom";

const Resource = ({
  userName,
  resource,
  currentUser,
  role,
  backgroundColor,
  onDelete,
  onEdit,
}) => {
  const isOwner = currentUser === resource.userId;
  const isAdmin = role === "Admin";
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const basePath =
    role === "Admin"
      ? "/admin"
      : role === "Instructor"
      ? "/instructor"
      : "/student";

  const canDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    try {
      await resourceService.deleteResource(resource.id);
      if (onDelete) onDelete(resource.id);
    } catch (err) {
      console.error("Error deleting resource:", err);
    }
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

      const resourceReportDTO = {
        reportId: reportId,
        resourceId: resource.id,
      };

      await reportsService.addResourceReport(resourceReportDTO);

      alert("Resource report submitted successfully.");
      setReportVisible(false);
    } catch (err) {
      console.error("Error submitting resource report:", err);
      alert("Failed to submit resource report.");
    }
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEdit = (updatedResource) => {
    if (onEdit) onEdit(updatedResource);
  };

  const handleViewResource = () => {
    if (!resource.path) return;

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

  const menu = (
    <Menu>
      {isOwner && (
        <Menu.Item key="edit" icon={<EditOutlined />} onClick={handleEditClick}>
          Edit
        </Menu.Item>
      )}
      {canDelete && (
        <Menu.Item key="delete" icon={<DeleteOutlined />}>
          <Popconfirm
            title="Are you sure you want to delete this resource?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <span>Delete</span>
          </Popconfirm>
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
          <p>{formatDateTime(resource.timestamp)}</p>
          <Link to={`${basePath}/users/${resource.userId}`}>
            @{userName || "N/A"}
          </Link>
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

      <button className="view-resource-link" onClick={handleViewResource}>
        View <ArrowRightOutlined />
      </button>

      <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={resource.id}
        onSubmit={handleReportSubmit}
      />

      <EditResourceModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onEdit={handleEdit}
        resource={resource}
      />
    </div>
  );
};

export default Resource;
