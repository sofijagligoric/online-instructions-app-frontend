import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ViewQuestion from "./ViewQuestion";
import threadService from "../../services/thread.service";
import userService from "../../services/user.service";
import { useAuth } from "../../components/AuthContext/AuthContext";

export default function ViewQuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId, role } = useAuth();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await threadService.getById(id);
        const q = res.data;
        setQuestion(q);

        if (q?.userId) {
          const user = await userService.getUserById(q.userId);
          setAuthor(user);
        }
      } catch (err) {
        console.error("Greška pri dohvaćanju podataka:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!question) return <p>Pitanje nije pronađeno.</p>;

  return (
    <ViewQuestion
      questionRecieved={question}
      currentUser={userId}
      role={role}
      author={author}
    />
  );
}
