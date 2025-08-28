import React, { useEffect, useState } from "react";
import { Modal, Form, Input } from "antd";
import { Select } from "antd";
import "./AddAdvertModal.css";
import advertsService from "../../services/adverts.service";
import categoryService from "../../services/category.service";
const { Option } = Select;

const AddAdvertModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
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
    try {
      const values = await form.validateFields();

      const advertData = {
        title: values.title,
        description: values.description,
        instructorId: 2, 
        categoryId: categoryId,
        timestamp: new Date().toISOString(), 
      };

      const response = await advertsService.addAdvert(advertData);

      form.resetFields();
      onAdd(response.data);
    } catch (err) {
      console.error("Error creating advert:", err);
    }
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
        <button key="cancel" className="cancel-advert-button" onClick={onCancel}>
          Cancel
        </button>,
        <button key="submit" type="primary" onClick={handleOk}>
          Add Advert
        </button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Advert Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter advert title" />
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
          <Input.TextArea
            placeholder="Enter description"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdvertModal;

