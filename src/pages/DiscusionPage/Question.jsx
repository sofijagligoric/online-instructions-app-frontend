import React, { useState } from "react";
import "./Question.css";
import CreateReportModal from "../../components/CreateReport/CreateReportModal";
import "../../App.css";
import { Menu, Dropdown, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  MoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Question = ({ question, currentUser, backgroundColor }) => {
  const isOwner = currentUser?.id === question.authorId;
  const isAdmin = currentUser?.role === "admin";
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);

  const canDelete = isOwner || isAdmin;

  const handleDelete = () => {
    alert("Question deleted.");
  };

  const handleEdit = () => {
    alert("Edit question.");
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
    <div className="question-card" style={{ backgroundColor }}>
      <div className="question-header">
        <div className="question-info">
          <p>{question.date || "01.02.2025."}</p>
          <p>@{question.authorUsername || "korisnik1"}</p>
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
      <Link to={`thread/${question.id}`} className="view-question-link">
        View details <ArrowRightOutlined />
      </Link>
      <CreateReportModal
        visible={reportVisible}
        onCancel={() => setReportVisible(false)}
        advertId={question.id}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Question;
