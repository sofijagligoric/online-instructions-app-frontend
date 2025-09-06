import React, { useState } from "react";
import { Modal, Form } from "antd";
import "../../pages/LoginPage/ForgotPasswordModal.css";
import "../../App.css";
import accountService from "../../services/account.service";
import { useAuth } from "../../components/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePasswordModal = ({ visible, onCancel, userId }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!oldPassword) {
      alert("Please enter your old password.");
      return;
    }
    if (!newPassword || !newPassword2) {
      alert("Please enter your new password.");
      return;
    }
    if (newPassword !== newPassword2) {
      alert("New passwords do not match.");
      return;
    }

    const updatedPasswordDTO = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const response = await accountService.passwordChange(
        userId,
        updatedPasswordDTO
      );
      setOldPassword("");
      setNewPassword("");
      setNewPassword2("");
      onCancel();
      if (typeof logout === "function") logout();
      alert("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Failed to update password.");
    }
  };
  return (
    <Modal
      title="Change password"
      open={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName="custom-forgot-password-modal"
      centered
    >
      <Form layout="vertical" className="forgot-password-form">
        <input
          type="password"
          placeholder="Old password"
          className="forgot-password-input"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          className="forgot-password-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="forgot-password-input"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
        />

        <div className="forgot-password-modal-buttons">
          <button className="cancel-forgot-password-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit}>
            {" "}
            Submit{" "}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
