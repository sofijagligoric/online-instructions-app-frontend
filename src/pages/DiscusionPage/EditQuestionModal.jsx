import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import questionsService from "../../services/thread.service";
import categoryService from "../../services/category.service";
import { Upload, Image } from "antd";
const { Option } = Select;

const EditQuestionModal = ({ visible, onCancel, onEdit, question }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

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
  }, []);

  useEffect(() => {
    if (question) {
      form.setFieldsValue({
        title: question.title,
        description: question.description,
      });
      setCategoryId(question.categoryId || null);

      if (question.imagePath) {
        setPreview(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8080"
          }/uploads/threads/${question.imagePath}`
        );
      }
    }
  }, [question, form]);
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedQuestionDTO = {
        userId: question.userId,
        id: question.id,
        title: values.title,
        description: values.description,
        categoryId,
        timestamp: question.timestamp,
        imagePath: file
          ? question.imagePath
          : preview
          ? question.imagePath
          : null,
      };

      let response = await questionsService.editDiscussionThread(
        updatedQuestionDTO.id,
        updatedQuestionDTO
      );

      if (file) {
        const uploadResp = await questionsService.uploadThreadImage(
          updatedQuestionDTO.id,
          file
        );

        response.data.imagePath = uploadResp.data;
      }
      alert("Thread edited!");
      onEdit(response.data);
      onCancel();
    } catch (err) {
      console.error("Error updating question:", err);
      alert("There was a problem while updating this thread.");
    }
  };
  return (
    <Modal
      title="Edit Question"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Edit Question"
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
          Edit
        </button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Question Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter question title" />
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
          name="description"
          label="Description"
          rules={[{ required: false }]}
        >
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>

        <Form.Item label="Image">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              setPreview(URL.createObjectURL(file));
              return false;
            }}
            maxCount={1}
            accept="image/*"
            showUploadList={false}
          >
            <button type="button">
              {file || preview ? "Change image" : "Upload image (optional)"}
            </button>
          </Upload>

          {preview && (
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginTop: 8,
              }}
            >
              <Image
                src={preview}
                width={100}
                height={100}
                style={{ marginLeft: "10px" }}
              />
              <button
                type="button"
                className="remove-image-btn"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                ×
              </button>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditQuestionModal;
