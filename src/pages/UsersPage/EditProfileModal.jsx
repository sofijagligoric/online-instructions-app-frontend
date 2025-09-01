import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import "./EditProfileModal.css";
import { updateAccount } from "../../services/account.service";
import { updateUser } from "../../services/user.service";

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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();


      await updateAccount(user.id, {
        id: user.id,
        username: values.username,
        password: "pppp",
        type: user.type.toUpperCase(),
        created: user.dateCreated,
        isActive: user.isActive,
      });


      await updateUser(user.id, {
        account_id: user.id,
        fName: values.firstName,
        lName: values.lastName,
        email: values.email,
        phone: values.phone,
      });

      onSave({ ...user, ...values }); 
      onCancel(); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Modal
      title="Edit Profile"
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
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
        <button key="submit" type="primary" onClick={handleSave}>
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