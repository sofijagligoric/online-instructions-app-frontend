// pages/DiscusionPage/ViewQuestionPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ViewQuestion from "./ViewQuestion";

const mockQuestions = [
  {
    id: "1",
    title: "Kako napraviti React routing?",
    description: "Imam problem s navigacijom između stranica...",
    date: "09.08.2025.",
    authorUsername: "korisnik1",
    authorId: 1,
    comments: [
      {
        id: "c1",
        text: "Pogledaj react-router-dom dokumentaciju.",
        date: "09.08.2025.",
        authorUsername: "devMaster",
        authorId: 2
      },
      {
        id: "c2",
        text: "Možeš koristiti <Outlet> za nested rute.",
        date: "09.08.2025.",
        authorUsername: "reactFan",
        authorId: 3
      }
    ]
  },
  {
    id: "2",
    title: "Kako optimizirati React aplikaciju?",
    description: "Stranica se sporo učitava...",
    date: "08.08.2025.",
    authorUsername: "korisnik2",
    authorId: 2,
    comments: []
  }
];

const currentUser = { id: 2, role: "student", username: "devMaster" };

export default function ViewQuestionPage() {
  const { id } = useParams();
  const question = mockQuestions.find(q => q.id === id);

  if (!question) return <p>Pitanje nije pronađeno.</p>;

  return (
    <ViewQuestion question={question} currentUser={currentUser} />
  );
}