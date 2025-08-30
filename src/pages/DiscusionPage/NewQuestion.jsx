import React, { useState, useEffect } from "react";
import "./NewQuestion.css";
import { Select } from "antd";
import threadService from "../../services/thread.service";
const { Option } = Select;

const NewQuestion = ({ categories = [], onSubmit }) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();

  if (!category || !title.trim()) {
    alert("Please fill all the fields.");
    return;
  }

  const newQuestion = { 
    categoryId: category, 
    title, 
    description,
    userId: 2 
  };

  onSubmit && onSubmit(newQuestion);

  setCategory("");
  setTitle("");
  setDescription("");
};

  return (
    <div className="new-question">
      <h2 className="new-question-title">Ask a new question</h2>
      <form onSubmit={handleSubmit}>
        <Select
          value={category || undefined}
          placeholder="Select category"
          onChange={(value) => setCategory(value)}
          className="custom-sort-select"
        >
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.name}
            </Option>
          ))}
        </Select>

        <input
          type="text"
          placeholder="Question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe your question..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit">Post Question</button>
      </form>
    </div>
  );
};

export default NewQuestion;
