import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Button, Input, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Comment from "./Comment";
import "./ViewQuestion.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import commentService from "../../services/comment.service";
import threadService from "../../services/thread.service";
import EditQuestionModal from "./EditQuestionModal";
import { formatDateTime } from "../../utils/formatDateTime";
import userService from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import reportsService from "../../services/report.service";

export default function ViewQuestion({ questionRecieved, currentUser, role, author }) {
   const [question, setQuestion] = useState(questionRecieved); 
   const navigate = useNavigate();
  const isOwner = currentUser === question.userId;
  const isAdmin = role === "Admin";
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
   const [users, setUsers] = useState({});
  const [reportVisible, setReportVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const commentsPerPage = 4;
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage
  );

  const canDelete = isOwner || isAdmin;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getCommentsByThread(question.id);
        setComments(data);
      } catch (err) {
        console.error("Greška pri učitavanju komentara:", err);
      } finally {
        setLoading(false);
      }
    };

      const fetchUsers = async () => {
          try {
            const usersList = await userService.getAllUsers();
            const usersMap = usersList.reduce((acc, instructor) => {
              if (!instructor) return acc; // skip null
              acc[instructor.id] = instructor;
              return acc;
            }, {});
            setUsers(usersMap);
          } catch (err) {
            console.error("Error fetching users:", err);
          }
        };
    
    fetchComments();
     fetchUsers();
  }, [question.id]);

const handleDelete = async () => {
  try {
    await threadService.deleteDiscussionThread(question.id);
  
    let prefix = "";
    if (role === "Admin") prefix = "admin";
    else if (role === "Instructor") prefix = "instructor";
    else if (role === "Student") prefix = "student";

    navigate(`/${prefix}/discusion`);
  } catch (err) {
    console.error("Error deleting thread:", err);
  }
};

    const handleEdit = (updatedData) => {
    setQuestion((prev) => ({
      ...prev,
      ...updatedData,
    }));
    setIsEditModalVisible(false);
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
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

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const commentObj = {
      description: newComment,
      threadId: question.id,
      userId: currentUser,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await commentService.addComment(commentObj);
      setComments([response.data, ...comments]);
      setNewComment("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Greška pri dodavanju komentara:", err);
      alert("Failed to create comment.");
    }
  };

    const handleDeleteComment = (id) => {
    setComments((prev) => prev.filter((ad) => ad.id !== id));
  };

  return (
    <div className="view-question-container">
      <div className="view-question-header">
        <div className="view-question-info">
          <p>{formatDateTime(question.timestamp)}</p>
                   <p>@{author.username || "N/A"}</p>
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

        {loading ? (
          <p>Loading comments...</p>
        ) : currentComments.length > 0 ? (
          currentComments.map((comment, index) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              isLast={index === currentComments.length - 1}
               author={users[comment.userId]?.username}
                onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <p>No comments yet.</p>
        )}

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

      <EditQuestionModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onEdit={handleEdit}
        question={question}
      />

    </div>
  );
}
