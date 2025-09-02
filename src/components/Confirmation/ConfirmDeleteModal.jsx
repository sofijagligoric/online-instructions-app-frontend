import React from 'react';
import { Modal } from 'antd';
import "./ConfirmDeleteModal.css";

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel }) => (
  <Modal
    title="Confirm"
    open={visible}
    onOk={onConfirm}
    onCancel={onCancel}
    okText="Delete"
    cancelText="Cancel"
     className="confirm-delete-modal"
      footer={null}
      centered
  >
    <p>Do you want to delete selected item?</p>

     <div className="confirm-delete-modal-buttons">
          <button className="cancel-delete-modal-button" onClick={onCancel}>
            Cancel
          </button>
          <button key="submit" type="primary" onClick={onConfirm}>
            Delete
          </button>
        </div>
  </Modal>
);

export default ConfirmDeleteModal;