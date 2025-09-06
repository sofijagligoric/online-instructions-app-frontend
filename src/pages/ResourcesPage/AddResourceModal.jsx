import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Select } from "antd";
import "./AddResourceModal.css";
import categoryService from "../../services/category.service";
import resourceService from "../../services/resource.service";
import { useAuth } from "../../components/AuthContext/AuthContext";
const { Option } = Select;

const AddResourceModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  /* const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(""); */
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { userId } = useAuth();
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategorys();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
    setCategoryId(1);
  }, []);

const handleOk = async () => {
  form.validateFields()
    .then(async (values) => {
      if (!selectedFile) {
        alert("Please select a file");
        return;
      }

      try {
        const uploadResponse = await resourceService.uploadResourceFile(selectedFile);
        const filePath = uploadResponse.data.split(": ")[1];

        const resourceData = {
          title: values.title,
          userId: userId,
          categoryId: categoryId,
          path: filePath,
        };

        const addedResourceResponse = await resourceService.addResource(resourceData);
        const addedResource = addedResourceResponse.data; 

        onAdd(addedResource); 

        form.resetFields();
        setSelectedFile(null);
      } catch (err) {
        console.error("Error uploading resource:", err);
        alert("Failed to upload resource");
      }
    })
    .catch((errorInfo) => {
      alert("Please fill in all required fields"); 
      console.log("Validation failed:", errorInfo);
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
          label="Resource Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter resource title" />
        </Form.Item>

        <Form.Item label="Category" required>
          <Select
            value={categoryId}
            placeholder="Select category"
            onChange={setCategoryId}
            className="custom-sort-select"
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
        >
          <Upload.Dragger
            name="file"
            multiple={false}
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false;
            }}
            fileList={selectedFile ? [selectedFile] : []}
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
