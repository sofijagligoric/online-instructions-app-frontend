import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import "./EditProfileModal.css";

const EditProfileModal = ({ visible, onCancel, onSave, user }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
        onCancel();
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  return (
    <Modal
      title="Edit Profile"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered
      className="custom-edit-profile-modal"
      footer={[
        <button
          key="cancel"
          className="cancel-profile-button"
          onClick={onCancel}
        >
          Cancel
        </button>,
        <button key="submit" type="primary" onClick={handleOk}>
          Save Changes
        </button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter username" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item name="phone" label="Phone">
          <Input placeholder="Enter phone number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;