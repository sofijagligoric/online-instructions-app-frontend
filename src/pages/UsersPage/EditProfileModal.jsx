import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import "./EditProfileModal.css";
import userService from "../../services/user.service";
import accountService from "../../services/account.service";
import { useAuth } from "../../components/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({
  visible,
  onCancel,
  onSave,
  user,
  userId,
  role,
}) => {
  const [form] = Form.useForm();
  const { logout } = useAuth();

  const navigate = useNavigate();
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

  /*  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (values.username !== user.username) {
        try {
          await accountService.checkUsername(values.username);
          alert("Username already exists, please choose another one.");
          return;
        } catch (err) {
          if (err.response && err.response.status !== 404) {
            alert("Something went wrong while checking username.");
            return;
          }
        }
      }
      const payload = {
        account: {
          username: values.username,
          type: role,
          created: user.created,
          isActive: user.isActive,
        },
        user: {
          fName: values.firstName,
          lName: values.lastName,
          email: values.email,
          phone: values.phone || null,
        },
      };
      await userService.updateUser(userId, payload);

      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (values.username !== savedUser.username) {
        if (typeof logout === "function") logout();
        alert("Username changed. Please log in again.");
        navigate("/login");
        return;
      }

      const updatedUser = { ...user, ...values };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile info updated!");
      onSave(updatedUser);
      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Problem occurred! Please try again.");
    }
  }; */

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (values.username !== user.username) {
        try {
          await accountService.checkUsername(values.username);
          alert("Username already exists, please choose another one.");
          return;
        } catch (err) {
          if (!(err.response && err.response.status === 404)) {
            alert("Something went wrong while checking username.");
            return;
          }
        }
      }

      const payload = {
        account: {
          username: values.username,
          type: role,
          created: user.created,
          isActive: user.isActive,
        },
        user: {
          fName: values.firstName,
          lName: values.lastName,
          email: values.email,
          phone: values.phone || null,
        },
      };

      await userService.updateUser(userId, payload);

      if (values.username !== user.username) {
        if (typeof logout === "function") logout();
        alert("Username changed. Please log in again.");
        navigate("/login");
        return;
      }

      const updatedUser = { ...user, ...values };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile info updated!");
      onSave(updatedUser);
      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Problem occurred! Please try again.");
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
