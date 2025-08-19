import React from "react";
import "./User.css";
import "../../App.css";
import { Link } from "react-router-dom";

const User = ({ user, backgroundColor }) => {
  const getInitials = (firstName, lastName) => {
    return (
      (firstName?.charAt(0) || "").toUpperCase() +
      (lastName?.charAt(0) || "").toUpperCase()
    );
  };

  return (
   <Link 
  to={`${user.id}`} 
  state={{ user, backgroundColor: backgroundColor }} 
  className="user-card"
>
      <div className="user-avatar" style={{ backgroundColor }}>
        {getInitials(user.firstName, user.lastName)}
      </div>
      <div className="user-info">
        <h3 className="user-name">
          {user.firstName} {user.lastName}
        </h3>
        <p className="user-username">@{user.username}</p>
      </div>
    </Link>
  );
};

export default User;