import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import advertsService from "../../services/adverts.service";
import categoryService from "../../services/category.service";
const { Option } = Select;

const EditAdvertModal = ({ visible, onCancel, onEdit, advert }) => {
  const [form] = Form.useForm();
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
  }, []);

  useEffect(() => {
    if (advert) {
      form.setFieldsValue({
        title: advert.title,
        description: advert.description,
      });
      setCategoryId(advert.categoryId || null);
    }
  }, [advert, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const updatedAdvertDTO = {
        id: advert.id,
        title: values.title,
        description: values.description,
        instructorId: advert.instructorId,
        categoryId: categoryId,
        timestamp: advert.timestamp,
      };

      const response = await advertsService.editAdvert(
        updatedAdvertDTO.id,
        updatedAdvertDTO
      );

      alert("Advert updated successfully!");
      onEdit(response.data);
      onCancel();
    } catch (err) {
      console.error("Error updating advert:", err);
      alert("Failed to update advert.");
    }
  };
  return (
    <Modal
      title="Edit Advert"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Edit Advert"
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
          <Input.TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAdvertModal;
