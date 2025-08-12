import React, { useEffect, useState } from "react";
import { Modal, Form, Input } from "antd";
import { Select } from "antd";
import "./AddAdvertModal.css";
const { Option } = Select;

const AddAdvertModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    setCategories([
      { id: 1, name: "Mathematics" },
      { id: 2, name: "Programming" },
      { id: 3, name: "Languages" },
    ]);
    setCategory(1);
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          ...values,
          category: categories.find((c) => c.id === category)?.name || "",
        };

        alert(
          `Title: ${formData.title}\nDescription: ${formData.description}\nCategory: ${formData.category}`
        );

        ///  onAdd(formData);

        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  return (
    <Modal
      title="Add New Advert"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Add Advert"
      centered
      className="custom-add-advert-modal"
      footer={[
        <button
          key="cancel"
          className="cancel-advert-button"
          onClick={onCancel}
        >
          Cancel
        </button>,
        <button key="submit" type="primary" onClick={handleOk}>
          {" "}
          Add Advert{" "}
        </button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Advert Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter advert title" />
        </Form.Item>

        <Form.Item label="Category" required>
          <Select
            value={category}
            placeholder="Select category"
            onChange={(value) => setCategory(value)}
            className="custom-sort-select"
            style={{ boxShadow: "none" }}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: false, message: "Please enter description" }]}
        >
          <Input.TextArea
            placeholder="Enter description"
            rows={4} 
            autoSize={{ minRows: 4, maxRows: 4 }} 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdvertModal;
