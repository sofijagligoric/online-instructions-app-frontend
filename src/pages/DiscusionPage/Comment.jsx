import React, { useState } from "react";
import { Menu, Dropdown, Button } from "antd";
import { DeleteOutlined, FlagOutlined, MoreOutlined } from "@ant-design/icons";
import "./Comment.css";

export default function Comment({ comment, currentUser, isLast }) {
  const isOwner = currentUser?.id === comment.authorId;
  const isAdmin = currentUser?.role === "admin";
  const [expanded, setExpanded] = useState(false);

  const menu = (
    <Menu>
      {isOwner && (
        <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => alert("Delete comment")}>
          Delete
        </Menu.Item>
      )}
      {!isAdmin && (
        <Menu.Item key="report" icon={<FlagOutlined />} onClick={() => alert("Report comment")}>
          Report
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className={`comment-item ${isLast ? "last" : ""}`}>
      <div className="comment-header">
        <p>{comment.date} | @{comment.authorUsername}</p>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Button shape="circle" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      </div>
      <p
        className={`comment-text ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        {comment.text}
      </p>
    </div>
  );
}