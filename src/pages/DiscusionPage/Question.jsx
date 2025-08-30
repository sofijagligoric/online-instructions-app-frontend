import React, { useState } from "react";
import "./Question.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import "../../App.css";
import { Menu, Dropdown, Button } from "antd";
import { formatDateTime } from "../../utils/formatDateTime";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import threadService from "../../services/thread.service";
import EditQuestionModal from "./EditQuestionModal";

const Question = ({
  question,
  currentUser,
  backgroundColor,
  userName,
  onDelete,
  onEdit,
}) => {
  const isOwner = currentUser?.id === question.userId;
  const isAdmin = currentUser?.role === "admin";
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const basePath =
    currentUser.role === "admin"
      ? "/admin"
      : currentUser.role === "instructor"
      ? "/instructor"
      : "/student";
  const canDelete = isOwner || isAdmin;

  const handleDelete = async () => {
    try {
      await threadService.deleteDiscussionThread(question.id);
      alert("Thread deleted.");
      if (onDelete) onDelete(question.id);
    } catch (err) {
      console.error("Error deleting thread:", err);
      alert("Failed to delete thread.");
    }
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEdit = (updatedQuestion) => {
    if (onEdit) onEdit(updatedQuestion);
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
    <div className="question-card" style={{ backgroundColor }}>
      <div className="question-header">
        <div className="question-info">
          <p>{formatDateTime(question.timestamp)}</p>
          <p>@{userName || "N/A"}</p>
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
        className={`question-title ${showFullTitle ? "full" : ""}`}
        onClick={() => setShowFullTitle(!showFullTitle)}
        style={{ marginBottom: "10px" }}
      >
        <h3>{question.title}</h3>
      </div>
      <Link
        to={`${basePath}/discusion/thread/${question.id}`}
        className="view-question-link"
      >
        View details <ArrowRightOutlined />
      </Link>
      <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={question.id}
        onSubmit={handleReportSubmit}
      />

       <EditQuestionModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onEdit={handleEdit}
        question={question}
      />
    </div>
  );
};

export default Question;
