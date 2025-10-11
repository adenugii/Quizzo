"use client";
import { useEffect, useState } from "react";

import { getMyQuiz } from "@/services/quizservices";
import QuizSayaListSection from "./QuizSayaListSection";

export default function QuizSayaClientWrapper({ token }: { token: string }) {
  const [quiz, setQuiz] = useState<any[]>([]);
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
