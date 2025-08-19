import React, { useState } from "react";
import { Modal, Form, } from "antd";
import "../../pages/LoginPage/ForgotPasswordModal.css";
import "../../App.css";

const ChangePasswordModal = ({visible, onCancel}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const handleSubmit = () => {
    if (!oldPassword) {
      alert("Please enter your old password.");
      return;
    }
     if (!newPassword  || !newPassword2) {
      alert("Please enter your new password.");
      return;
    }
    alert(
      `Old: ${oldPassword}\nNew: ${newPassword}\nNew again: ${newPassword2
      }`
    );
    setOldPassword("");
     setNewPassword("");
    setNewPassword2("");
    onCancel(); 
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
      <Form layout="vertical" className="forgot-password-form" >
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
          <button key="submit" type="primary" onClick={handleSubmit}>
            {" "}
            Submit{" "}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
