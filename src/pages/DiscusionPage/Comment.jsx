import React, { useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { DeleteOutlined, FlagOutlined, MoreOutlined } from "@ant-design/icons";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import { formatDateTime } from "../../utils/formatDateTime";
import "./Comment.css";
import commentService from "../../services/comment.service";
import reportsService from "../../services/report.service";
import ConfirmDeleteModal from "../../components/Confirmation/ConfirmDeleteModal";

export default function Comment({ comment, currentUser, role, isLast, author, onDelete }) {
  const isOwner = currentUser === comment.userId;
  const isAdmin = role === "Admin";
  const [expanded, setExpanded] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const canDelete = isOwner || isAdmin;
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

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
  
      const commentReportDTO = {
        reportId: reportId,
        commentId: comment.id, 
      };
  
      await reportsService.addCommentReport(commentReportDTO);
  
      alert("Comment report submitted successfully.");
      setReportVisible(false);
    } catch (err) {
      console.error("Error submitting Comment report:", err);
      alert("Failed to submit Comment report.");
    }
  };

  const handleDelete = async () => {
      try {
        await commentService.deleteComment(comment.id);
         if (onDelete) onDelete(comment.id);
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    };

  const menu = (
    <Menu>
      {isOwner && (
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
    <div className={`comment-item ${isLast ? "last" : ""}`}>
      <div className="comment-header">

        <p>{formatDateTime(comment.timestamp)} @{author || "N/A"}</p>

        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Button shape="circle" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      </div>
      <p
        className={`comment-text ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        {comment.description}
      </p>
      <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={comment.id}
        onSubmit={handleReportSubmit}
      />

        <ConfirmDeleteModal
            visible={isDeleteModalVisible}
            onConfirm={handleDelete}
            onCancel={() => setIsDeleteModalVisible(false)}
          />
    </div>
  );
}
