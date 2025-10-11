"use client";
import { useState, useEffect } from "react";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizCard from "@/components/quiz/QuizCard";
import QuizNavigation from "@/components/quiz/QuizNavigation";
import Footer from "@/components/common/Footer";
import { useRouter } from "next/navigation";
import { getQuizById, attemptQuiz } from "@/services/quizservices";
import SidebarQuizNavigation from "@/components/quiz/SidebarQuizNavigation";

// Ganti semua any dengan tipe spesifik
interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit?: { String: string; Valid: boolean };
  created_by: string;
  questions: QuizQuestion[];
  created_at: string;
}
interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: QuizOption[];
}
interface QuizOption {
  id: string;
  content: string;
}
interface QuizResult {
  attempts?: {
    score: number;
    total_questions: number;
    submitted_at: string;
  }[];
  error?: string;
}

export default function QuizSoalClient({ quizId, soalId, token }: { quizId: string; soalId: string; token: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selected, setSelected] = useState<number>(-1);
  const [timeUp, setTimeUp] = useState(false);
  const [marked, setMarked] = useState<boolean[]>([]);

  useEffect(() => {
    // Ambil answers dari localStorage jika ada
    const storageKey = `quiz-answers-${quizId}`;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {}
    }
    // Ambil marked dari localStorage jika ada
    const markedKey = `quiz-marked-${quizId}`;
    const savedMarked = typeof window !== 'undefined' ? localStorage.getItem(markedKey) : null;
    async function fetchQuiz() {
      setLoading(true);
      const data = await getQuizById(token, quizId);
      setQuiz(data);
      if (data && data.questions) {
        setAnswers((prev) => {
          if (Object.keys(prev).length === 0) {
            const initial: Record<string, string> = {};
            data.questions.forEach((q: QuizQuestion) => {
              initial[q.id] = "";
            });
            if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(initial));
            return initial;
          }
          return prev;
        });
        if (savedMarked) {
          try {
            setMarked(JSON.parse(savedMarked));
          } catch {
            setMarked(Array(data.questions.length).fill(false));
          }
        } else {
          setMarked(Array(data.questions.length).fill(false));
        }
      }
      setLoading(false);
    }
    fetchQuiz();
  }, [quizId, token]);

  useEffect(() => {
    if (!quiz) {
      setSelected(-1);
      return;
    }
    const current = quiz.questions.findIndex((q) => q.id === soalId);
    if (current === -1) {
      setSelected(-1);
      return;
    }
    const question = quiz.questions[current];
    if (answers && question) {
      const idx = question.options.findIndex((opt: QuizOption) => opt.id === answers[question.id]);
      setSelected(idx);
    } else {
      setSelected(-1);
    }
  }, [soalId, quiz, answers]);

  if (loading) {
    return <div className="text-center mt-10 text-[#2563eb]">Loading...</div>;
  }
  if (!quiz) {
    return <div className="text-center mt-10 text-red-500">Quiz tidak ditemukan.</div>;
  }
  const current = quiz.questions.findIndex((q) => q.id === soalId);
  const total = quiz.questions.length;
  const question = quiz.questions[current];

  // Navigasi soal
  const handlePrev = () => {
    if (current > 0) {
      const prevId = quiz.questions[current - 1].id;
      router.push(`/quiz-maker/${quizId}/${prevId}`);
    }
  };
  const handleNext = () => {
    if (current < total - 1) {
      const nextId = quiz.questions[current + 1].id;
      router.push(`/quiz-maker/${quizId}/${nextId}`);
    }
  };
  const handleSubmit = async (force = false) => {
    // Cek apakah semua soal sudah dijawab
    const allAnswered = quiz.questions.every((q) => answers[q.id] && answers[q.id] !== "");
    if (!allAnswered && !force) {
      alert("Harap jawab semua soal sebelum mengumpulkan quiz!");
      return;
    }
    setShowResult(true);
    try {
      // Hanya kirim jawaban yang diisi
      const filteredAnswers: Record<string, string> = {};
      Object.entries(answers).forEach(([qid, oid]) => {
        if (oid && oid !== "") filteredAnswers[qid] = oid;
      });
      console.log("[QUIZ SUBMIT] answers dikirim:", filteredAnswers);
      const attemptRes = await attemptQuiz(token, quizId, filteredAnswers);
      setResult(attemptRes);
      // Hapus jawaban dari localStorage setelah submit
      const storageKey = `quiz-answers-${quizId}`;
      if (typeof window !== 'undefined') localStorage.removeItem(storageKey);
      // Redirect ke quiz-result/[idAttempt]
      if (attemptRes && attemptRes.attempt_id) {
        router.push(`/quiz-result/${attemptRes.attempt_id}`);
        return;
      }
      // Fallback: jika tidak ada id attempt, tampilkan error
    
    } catch {
     
    }
  };

  // Set jawaban ketika memilih opsi
  const handleSelect = (idx: number) => {
    setSelected(idx);
    setAnswers((prev) => {
      const copy = { ...prev };
      copy[question.id] = question.options[idx].id;
      // Simpan ke localStorage setiap kali user memilih jawaban
      const storageKey = `quiz-answers-${quizId}`;
      if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(copy));
      return copy;
    });
  };

  // Handler tandai soal
  const handleMark = () => {
    setMarked((prev) => {
      const copy = [...prev];
      copy[current] = !copy[current];
      // Simpan ke localStorage
      const markedKey = `quiz-marked-${quizId}`;
      if (typeof window !== 'undefined') localStorage.setItem(markedKey, JSON.stringify(copy));
      return copy;
    });
  };
  // Handler klik nomor soal
  const handleGoto = (idx: number) => {
    if (quiz && quiz.questions[idx]) {
      router.push(`/quiz-maker/${quizId}/${quiz.questions[idx].id}`);
    }
  };

  // Ambil time_limit (detik) dari quiz
  let timeLimitSeconds = 0;
  if (quiz.time_limit && quiz.time_limit.Valid) {
    if (typeof quiz.time_limit.String !== 'undefined' && quiz.time_limit.String !== "") timeLimitSeconds = Number(quiz.time_limit.String);
    else if (typeof (quiz.time_limit as { Int64?: number }).Int64 !== 'undefined') timeLimitSeconds = Number((quiz.time_limit as { Int64?: number }).Int64);
    else if (typeof (quiz.time_limit as { Number?: number }).Number !== 'undefined') timeLimitSeconds = Number((quiz.time_limit as { Number?: number }).Number);
  }
  if (!timeLimitSeconds) timeLimitSeconds = 45 * 60; // fallback 45 menit

  // Format waktu untuk header
  const timeLimitMinutes = Math.ceil(timeLimitSeconds / 60);
  const timeLimitLabel = `${timeLimitMinutes} Menit`;

  // Handler saat waktu habis
  const handleTimeUp = () => {
    setTimeUp(true);
    setShowResult(true);
    handleSubmit(true);
  };

  if (showResult) {
    // Setelah menampilkan hasil, redirect ke quiz-result/[idAttempt] (handled in handleSubmit)
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center">
        {timeUp && (
          <div className="bg-red-100 text-red-700 px-6 py-3 rounded-lg mb-4 text-lg font-bold">Waktu Habis! Jawaban dikumpulkan otomatis.</div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full flex flex-col items-center">
          <div className="text-3xl mb-2 text-[#2563eb] font-bold">Hasil Quiz</div>
          {result && result.attempts && result.attempts.length > 0 ? (
            <>
              <div className="text-lg mb-4">Skor kamu: <span className="font-bold">{result.attempts[0].score} / {result.attempts[0].total_questions}</span></div>
              <div className="text-2xl font-bold text-green-600 mb-4">{Math.round((result.attempts[0].score / result.attempts[0].total_questions) * 100)}%</div>
              <div className="text-xs text-gray-500 mb-2">Dikumpulkan pada: {new Date(result.attempts[0].submitted_at).toLocaleString("id-ID")}</div>
            </>
          ) : (
            <div className="text-red-500 mb-4">{result?.error || "sedang menunggu hasil quiz."}</div>
          )}
          <button className="bg-[#2563eb] text-white rounded-md px-6 py-2 font-semibold hover:bg-[#174bbd] transition" onClick={() => router.push("/")}>Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <QuizHeader
        title={quiz.title}
        subtitle={quiz.description}
        time={timeLimitLabel}
      />
      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row-reverse gap-8">
        <SidebarQuizNavigation
          questions={quiz.questions}
          answers={answers}
          marked={marked}
          current={current}
          onGoto={handleGoto}
          quizId={quizId}
          timeLimitSeconds={timeLimitSeconds}
          onTimeUp={() => {
            handleTimeUp();
          }}
        />
        <div className="flex-1">
          <QuizProgress current={current} total={total} />
          <QuizCard
            title={quiz.title}
            subtitle={quiz.description}
            level={quiz.difficulty === "easy" ? "Mudah" : quiz.difficulty === "medium" ? "Sedang" : "Sulit"}
            levelColor={quiz.difficulty === "easy" ? "green" : quiz.difficulty === "medium" ? "yellow" : "red"}
            questions={total}
            time={Math.ceil(timeLimitSeconds / 60)}
            status="progress"
            question={question.question_text}
            options={question.options.map((opt) => opt.content)}
            selected={selected}
            setSelected={handleSelect}
          />
          <QuizNavigation
            current={current}
            total={total}
            marked={marked[current]}
            setMarked={handleMark}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <div className="flex justify-end mt-8">
            {current === total - 1 && (
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                onClick={() => handleSubmit()}
              >
                Kumpulkan
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
