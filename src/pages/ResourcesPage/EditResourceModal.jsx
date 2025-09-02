import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Select, message } from "antd";
import "./AddResourceModal.css";
import categoryService from "../../services/category.service";
import resourceService from "../../services/resource.service";
import { useAuth } from "../../components/AuthContext/AuthContext";
const { Option } = Select;

const EditResourceModal = ({ visible, onCancel, onEdit, resource }) => {
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

  useEffect(() => {
    if (resource) {
      form.setFieldsValue({
        title: resource.title,
        userId: resource.userId,
        categoryId: resource.categoryId,
        path: resource.filePath,
      });
      setCategoryId(resource.categoryId || null);

       if (resource.path) {
      setSelectedFile({
        uid: "-1", 
        name: resource.path, 
        status: "done",
        url: `http://localhost:8080/uploads/${resource.path}`, 
      });
    }
    }
  }, [resource, form]);

  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      if (!selectedFile) {
        alert("Please select a file");
        return;
      }

      try {
        const uploadResponse = await resourceService.uploadResourceFile(
          selectedFile
        );
        const filePath = uploadResponse.data.split(": ")[1];

        const resourceData = {
            
          title: values.title,
          userId: userId,
          categoryId: categoryId,
          path: filePath,
        };

        const response = await resourceService.editResource(
          resource.id,
          resourceData
        );
        //   const addedResource = addedResourceResponse.data;

        message.success("Resource updated successfully!");
        onEdit(response.data);
        onCancel();
      } catch (err) {
        console.error("Error uploading resource:", err);
        alert("Failed to upload resource");
      }
    });
  };

  return (
    <Modal
      title="Edit Resource"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Edit Resource"
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
          Edit Resource{" "}
        </button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/*  <Form.Item
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Resource Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter resource title" />
        </Form.Item> */}
        <Form.Item
          name="title"
          label="Resource Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter resource title" />
        </Form.Item>

        {/*  <Form.Item
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          label="Author Name"
          rules={[{ required: true, message: "Please enter author name" }]}
        >
          <Input placeholder="Enter author's name" />
        </Form.Item> */}
        {/*  <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please enter an author" }]}
        >
          <Input placeholder="Enter resource author" />
        </Form.Item> */}

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
          rules={[{ required: true, message: "Please upload a file" }]}
        >
          <Upload.Dragger
            name="file"
            multiple={false}
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false;
            }}
            onRemove={() => {
              setSelectedFile(null);
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

export default EditResourceModal;
