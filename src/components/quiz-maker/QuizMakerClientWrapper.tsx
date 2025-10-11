"use client";
import { useEffect, useState } from "react";
import UploadFormSection from "@/components/quiz-maker/UploadFormSection";
import TipsSection from "@/components/quiz-maker/TipsSection";
import MateriSayaSection from "@/components/quiz-maker/MateriSayaSection";
import { getMyQuiz } from "@/services/quizservices";

interface QuizMakerClientWrapperProps {
  token: string;
}

export type QuizType = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit?: { String: string; Valid: boolean };
  created_by: string;
  questions: { id: string; quiz_id: string; question_text: string; options: { id: string; content: string }[] }[];
  created_at: string;
};

export default function QuizMakerClientWrapper({ token }: QuizMakerClientWrapperProps) {
  const [quiz, setQuiz] = useState<QuizType[]>([]);

  const fetchQuiz = async () => {
    try {
      const response = await getMyQuiz(token);
      setQuiz(Array.isArray(response) ? response : response?.quiz || []);
    } catch {
      setQuiz([]);
    }
  };

  useEffect(() => {
    fetchQuiz();
    // eslint-disable-next-line
  }, [token]);

  const handleUploadSuccess = () => {
    fetchQuiz();
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        <UploadFormSection token={token} onUploadSuccess={handleUploadSuccess} />
        <TipsSection />
      </div>
      <MateriSayaSection quiz={quiz} />
    </>
  );
}
