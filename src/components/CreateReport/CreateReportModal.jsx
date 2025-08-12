import React, { useState } from "react";
import { Modal, Form, Radio, Input, Button } from "antd";
import "./CreateReportModal.css";
import "../../App.css";

const reasonsList = [
  "Spam",
  "Inappropriate content",
  "Harassment",
  "False information",
  "Other",
];

const CreateReportModal = ({ visible, onCancel, advertId, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }
    alert(
      `Advert ID: ${advertId}\nReason: ${reason}\nDescription: ${
        description || "N/A"
      }`
    );
    onSubmit({ advertId, reason, description });
    setReason("");
    setDescription("");
  };

  return (
    <Modal
      title="Report Advert"
      open={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName="custom-report-modal"
      centered
    >
      <Form layout="vertical">
        <Form.Item label="Reason for report" required>
          <Radio.Group
            onChange={(e) => setReason(e.target.value)}
            value={reason}
            className="custom-radio-group"
          >
            {reasonsList.map((r) => (
              <Radio key={r} value={r} className="custom-radio">
                {r}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Description (optional)">
          <Input.TextArea
            rows={4}
            placeholder="Additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="custom-textarea"
          />
        </Form.Item>

        <div className="report-modal-buttons">
          {/*  <Button className="cancel-report-button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button> */}

          <button className="cancel-report-button" onClick={onCancel}>
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

export default CreateReportModal;
