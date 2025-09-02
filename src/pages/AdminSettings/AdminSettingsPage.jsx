import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Table,
  Popconfirm,
  Card,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../App.css";
import "./AdminSettingsPage.css";
import categoryService from "../../services/category.service";
import violationService from "../../services/violationType.service";
import ChangePasswordModal from "../../components/ChangePassword/ChangePasswordModal";
import { useAuth } from "../../components/AuthContext/AuthContext";

const AdminSettings = () => {
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const { userId, role } = useAuth();

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    loadCategories();
    loadViolations();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategorys();
      setCategories(response.data);
    } catch (err) {
      console.error("Greška pri učitavanju kategorija!");
    }
  };

  const addCategory = async () => {
    if (!newCategory) return;
    try {
      const response = await categoryService.addCategory({ name: newCategory });
      setCategories([...categories, response.data]);
      setNewCategory("");
      alert("Category added!");
    } catch (err) {
      console.error("Greška pri dodavanju kategorije!");
    }
  };

  const editCategory = async (id, newName) => {
    try {
      await categoryService.editCategory(id, { name: newName });
      setCategories(
        categories.map((c) => (c.id === id ? { ...c, name: newName } : c))
      );
      alert("Category edited!");
    } catch (err) {
      console.error("Greška pri izmjeni kategorije!");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      alert("Category deleted!");
    } catch (err) {
      console.error("Greška pri brisanju kategorije!");
    }
  };

  const categoryColumns = [
    {
      title: "Category name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <EditableCell
          text={text}
          onSave={(newName) => editCategory(record.id, newName)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => deleteCategory(record.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const [violationTypes, setViolationTypes] = useState([]);
  const [newViolation, setNewViolation] = useState("");

  const loadViolations = async () => {
    try {
      const response = await violationService.getAllViolationTypes();
      setViolationTypes(response.data);
    } catch (err) {
      console.error("Greška pri učitavanju violation types!");
    }
  };

  const addViolation = async () => {
    if (!newViolation) return;
    try {
      const response = await violationService.addViolationType({
        name: newViolation,
      });
      setViolationTypes([...violationTypes, response.data]);
      setNewViolation("");
      alert("Violation type added!");
    } catch (err) {
      console.error("Greška pri dodavanju violation type!");
    }
  };

  const editViolation = async (id, newName) => {
    try {
      await violationService.editViolationType(id, { name: newName });
      setViolationTypes(
        violationTypes.map((v) => (v.id === id ? { ...v, name: newName } : v))
      );
      alert("Violation type edited!");
    } catch (err) {
      console.error("Greška pri izmjeni violation type!");
    }
  };

  const deleteViolation = async (id) => {
    try {
      await violationService.deleteViolationType(id);
      setViolationTypes(violationTypes.filter((v) => v.id !== id));
      alert("Violation type deleted!");
    } catch (err) {
      console.error("Greška pri brisanju violation type!");
    }
  };

  const violationColumns = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <EditableCell
          text={text}
          onSave={(newName) => editViolation(record.id, newName)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => deleteViolation(record.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }} className="admin-settings">
      <button
        className="settings-change-password"
        style={{ marginBottom: 24 }}
        onClick={() => setIsChangePasswordModalVisible(true)}
      >
        Change password
      </button>

      <ChangePasswordModal
        visible={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        userId={userId}
      />

      {/* Kategorije */}
      <Card title="Categories" style={{ marginBottom: 24 }}>
        <Input
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ width: 300, marginRight: 8 }}
        />
        <button
            className="create-button"
            onClick={addCategory}
          >
            Add category
          </button>
        <Table
          style={{ marginTop: 16 }}
          columns={categoryColumns}
          dataSource={categories}
          pagination={false}
        />
      </Card>

      {/* Violation Types */}
      <Card title="Violation Types">
        <Input
          placeholder="New violation type"
          value={newViolation}
          onChange={(e) => setNewViolation(e.target.value)}
          style={{ width: 300, marginRight: 8 }}
        />
       <button
            className="create-button"
            onClick={addViolation}
          >
            Add violation
          </button>
        <Table
          style={{ marginTop: 16 }}
          columns={violationColumns}
          dataSource={violationTypes}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminSettings;

const EditableCell = ({ text, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  const save = () => {
    if (value.trim() && value !== text) {
      onSave(value);
    }
    setEditing(false);
  };

  return editing ? (
    <div className="editable-cell">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={save}
        autoFocus
      />
      <Button type="primary" onClick={save}>
        Save
      </Button>
      <Button onClick={() => setEditing(false)}>Cancel</Button>
    </div>
  ) : (
    <div onClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
      {text} <EditOutlined style={{ marginLeft: 8, color: "#1890ff" }} />
    </div>
  );
};
