import React, { useState, useEffect } from "react";
import { Modal, Form, Radio, Input } from "antd";
import "./CreateReportModal.css";
import "../../App.css";
import violationTypeService from "../../services/violationType.service";

const CreateReportModal = ({ visible, onCancel, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [violationTypes, setViolationTypes] = useState([]);

  useEffect(() => {
    const fetchViolationTypes = async () => {
      try {
        const response = await violationTypeService.getAllViolationTypes();
        setViolationTypes(response.data);
      } catch (err) {
        console.error("Failed to load violation types:", err);
      }
    };

    fetchViolationTypes();
  }, []);

  const handleSubmit = () => {
    if (!reason) {
      alert("Please select a reason for reporting.");
      return;
    }

    onSubmit({ reason, description });
    setReason("");
    setDescription("");
  };

  return (
    <Modal
      title="Report Content"
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
            {violationTypes.map((v) => (
              <Radio key={v.id} value={v.id} className="custom-radio">
                {v.name}
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
          <button className="cancel-report-button" onClick={onCancel}>
            Cancel
          </button>
          <button key="submit" type="primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateReportModal;
