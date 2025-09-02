import React, { useState } from "react";
import { Modal, Form, } from "antd";
import "./ForgotPasswordModal.css";
import "../../App.css";

const ForgotPasswordModal = ({visible, onCancel}) => {
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const handleSubmit = () => {
    if (!newPassword || !newPassword2) {
      alert("Please enter your new password.");
      return;
    }
     setNewPassword("");
    setNewPassword2("");
    onCancel(); 
  };

  return (
    <Modal
      title="Forgot password"
      open={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName="custom-forgot-password-modal"
      centered
    >
      <Form layout="vertical" className="forgot-password-form" >
       
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

export default ForgotPasswordModal;
