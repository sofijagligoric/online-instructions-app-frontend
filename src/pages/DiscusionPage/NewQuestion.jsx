import React, { useState } from "react";
import "./NewQuestion.css";
import { Select, Upload, Image } from "antd";
import threadService from "../../services/thread.service";
import { useAuth } from "../../components/AuthContext/AuthContext";
const { Option } = Select;

const NewQuestion = ({ categories = [], onSubmit }) => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const { userId } = useAuth();
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !title.trim()) {
      alert("Please fill all the fields.");
      return;
    }

    const newThread = {
      categoryId: category,
      title,
      description,
      userId,
      imagePath: null,
    };

    try {
      const response = await threadService.addDiscussionThread(newThread);
      let threadData = response.data;
      if (file) {
        const uploadResp = await threadService.uploadThreadImage(
          threadData.id,
          file
        );
        threadData = { ...threadData, imagePath: uploadResp.data };
      }
      onSubmit && onSubmit(threadData);

      setCategory("");
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      alert("Thread created!");
    } catch (err) {
      console.error("Failed to create thread", err);
      alert("Failed to create thread");
    }
  };
  return (
    <div className="new-question">
      <h2 className="new-question-title">Ask a new question</h2>
      <form onSubmit={handleSubmit}>
        <Select
          value={category || undefined}
          placeholder="Select category"
          onChange={setCategory}
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
        />

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
            {file ? "Change image" : "Upload image (optional)"}
          </button>
        </Upload>

        {preview && (
          <div
            className="image-preview"
            style={{ position: "relative", display: "inline-block" }}
          >
            <Image src={preview} width={100} height={100} />
            <button
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

        <button type="submit">Post Question</button>
      </form>
    </div>
  );
};

export default NewQuestion;
