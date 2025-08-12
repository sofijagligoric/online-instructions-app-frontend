import React, { useState } from "react";
import { Menu, Dropdown, Button, Input } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Comment from "./Comment";
import "./ViewQuestion.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";

export default function ViewQuestion({ question, currentUser }) {
  const isOwner = currentUser?.id === question.authorId;
  const isAdmin = currentUser?.role === "admin";
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(question.comments || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportVisible, setReportVisible] = useState(false);
  const commentsPerPage = 4;
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage
  );

  const canDelete = isOwner || isAdmin;

  const handleReportSubmit = ({ advertId, reason, description }) => {
    // alert(`Advert ID: ${advertId}\nReason: ${reason}\nDescription: ${description || "N/A"}`);
    setReportVisible(false);
  };

  const menu = (
    <Menu>
      {isOwner && (
        <Menu.Item
          key="edit"
          icon={<EditOutlined />}
          onClick={() => alert("Edit question")}
        >
          Edit
        </Menu.Item>
      )}
      {canDelete && (
        <Menu.Item
          key="delete"
          icon={<DeleteOutlined />}
          onClick={() => alert("Delete question")}
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

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const commentObj = {
      id: Date.now().toString(),
      text: newComment,
      date: new Date().toLocaleDateString(),
      authorUsername: currentUser.username,
      authorId: currentUser.id,
    };
    setComments([commentObj, ...comments]);
    setNewComment("");
    setCurrentPage(1);
  };

  return (
    <div className="view-question-container">
      <div className="view-question-header">
        <div className="view-question-info">
          <p>{question.date}</p>
          <p>@{question.authorUsername}</p>
        </div>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      </div>

      <h2 className="view-question-title">{question.title}</h2>
      <p className="view-question-description">{question.description}</p>

      <div className="comments-list">
        {!isAdmin && (
          <div className="add-comment-section">
            <Input.TextArea
              rows={3}
              placeholder="Add comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="add-comment-button" onClick={handleAddComment}>
              Add comment
            </button>
          </div>
        )}

        {currentComments.map((comment, index) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            isLast={index === currentComments.length - 1}
          />
        ))}

        {totalPages > 1 && (
          <div
            className="pagination"
            style={{ marginBottom: "15px", marginTop: "5px" }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Back
            </button>
            <span>
              Page {currentPage} out of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={question.id}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
