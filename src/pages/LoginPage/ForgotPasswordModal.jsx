import React, { useState } from "react";
import { Modal, Form } from "antd";
import "./ForgotPasswordModal.css";
import "../../App.css";
import accountService from "../../services/account.service";

const ForgotPasswordModal = ({ visible, onCancel }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await accountService.forgotPassword(email);
      alert("Your new password is: " + response.data); 
      setEmail("");
      onCancel();
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.response && error.response.status === 404) {
        alert("No account found with this email.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
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
      <Form layout="vertical" className="forgot-password-form">
        <input
          type="email"
          placeholder="Email"
          className="forgot-password-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
