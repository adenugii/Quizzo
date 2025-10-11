"use client";
import { useEffect, useState } from "react";

import { getMyQuiz } from "@/services/quizservices";
import QuizSayaListSection from "./QuizSayaListSection";

interface QuizSayaClientWrapperProps {
  token: string;
}

export type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit?: { String: string; Valid: boolean };
  created_by: string;
  questions: { id: string; quiz_id: string; question_text: string; options: { id: string; content: string }[] }[];
  created_at: string;
};

export default function QuizSayaClientWrapper({ token }: QuizSayaClientWrapperProps) {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const response = await getMyQuiz(token);
      setQuiz(Array.isArray(response) ? response : response?.quiz || []);
    } catch {
      setQuiz([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line
  }, [token]);

  return (
    <QuizSayaListSection quiz={quiz} loading={loading} />
  );
}
