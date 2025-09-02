import React, { useState } from "react";
import "./Question.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import "../../App.css";
import { Menu, Dropdown, Button, Popconfirm } from "antd";
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
import reportsService from "../../services/report.service";
import EditQuestionModal from "./EditQuestionModal";

const Question = ({
  question,
  currentUser,
  role,
  backgroundColor,
  userName,
  onDelete,
  onEdit,
}) => {
  const isOwner = currentUser === question.userId;
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
      await threadService.deleteDiscussionThread(question.id);
      if (onDelete) onDelete(question.id);
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleEdit = (updatedQuestion) => {
    if (onEdit) onEdit(updatedQuestion);
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

    const questionReportDTO = {
      reportId: reportId,
      threadId: question.id, 
    };

    await reportsService.addThreadReport(questionReportDTO);

    alert("Thread report submitted successfully.");
    setReportVisible(false);
  } catch (err) {
    console.error("Error submitting Thread report:", err);
    alert("Failed to submit Thread report.");
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
            title="Are you sure you want to delete this thread?"
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
