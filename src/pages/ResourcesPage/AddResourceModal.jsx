import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Select } from "antd";
import "./AddResourceModal.css";
const { Option } = Select;

const AddResourceModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
          `Title: ${formData.title}\nAuthor: ${formData.author}\nCategory: ${formData.category}`
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
      title="Add New Resource"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Add Resource"
      centered
      className="custom-add-resource-modal"
      footer={[
        <button
          key="cancel"
          className="cancel-resource-button"
          onClick={onCancel}
        >
          Cancel
        </button>,
        <button key="submit" type="primary" onClick={handleOk}>
          {" "}
          Add Resource{" "}
        </button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Resource Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter resource title" />
        </Form.Item>

        <Form.Item
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          label="Author Name"
          rules={[{ required: true, message: "Please enter author name" }]}
        >
          <Input placeholder="Enter author's name" />
        </Form.Item>

        <Form.Item label="Category" required>
          <Select
            value={category}
            placeholder="Select category"
            onChange={(value) => setCategory(value)}
            className="custom-sort-select"
            style={{boxShadow: "none"}}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="file"
          label="Upload Resource"
          rules={[{ required: true, message: "Please upload a file" }]}
        >
          <Upload.Dragger
            name="file"
            multiple={false}
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supported formats: PDF, DOCX, PPTX...
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddResourceModal;
