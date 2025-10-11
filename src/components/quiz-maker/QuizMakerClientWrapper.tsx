"use client";
import { useEffect, useState } from "react";
import UploadFormSection from "@/components/quiz-maker/UploadFormSection";
import TipsSection from "@/components/quiz-maker/TipsSection";
import MateriSayaSection from "@/components/quiz-maker/MateriSayaSection";
import { getMyQuiz } from "@/services/quizservices";

export default function QuizMakerClientWrapper({ token }: { token: string }) {
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
