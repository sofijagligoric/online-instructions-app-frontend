import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import questionsService from "../../services/thread.service";
import categoryService from "../../services/category.service";
const { Option } = Select;


const EditQuestionModal = ({ visible, onCancel, onEdit, question }) => {
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
    if (question) {
      form.setFieldsValue({
        title: question.title,
        description: question.description,
      });
       setCategoryId(question.categoryId || null);
    }
  }, [question, form]);

 const handleOk = async () => {
  try {
    const values = await form.validateFields();

    const updatedQuestionDTO = {
      id: question.id,
      title: values.title,
      description: values.description,
      instructorId: question.instructorId, 
      categoryId: categoryId,   
      timestamp: question.timestamp,  
    };

    const response = await questionsService.editDiscussionThread(updatedQuestionDTO.id, updatedQuestionDTO);

    message.success("Question updated successfully!");
    onEdit(response.data); 
    onCancel();
  } catch (err) {
    console.error("Error updating question:", err);
    message.error("Failed to update question.");
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
           <button key="cancel" className="cancel-advert-button" onClick={onCancel}>
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
             <Input.TextArea
               placeholder="Enter description"
               rows={4}
             />
           </Form.Item>
         </Form>
       </Modal>
  );
};

export default EditQuestionModal;