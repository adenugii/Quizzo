const API_BASE_URL = process.env.API_BASE_URL || "https://api.gilanghuda.my.id";

export async function uploadQuiz({ file, num_questions, difficulty, description, token, time_limit }: {
  file: File;
  num_questions: number;
  difficulty: string;
  description?: string;
  token: string;
  time_limit?: number;
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("num_questions", String(num_questions));
  formData.append("difficulty", difficulty);
  if (description) formData.append("description", description);
  if (time_limit) formData.append("time_limit", String(time_limit));

  const res = await fetch(`${API_BASE_URL}/quiz/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Gagal upload quiz");
  }
  return res.json();
}

export async function getMyQuiz(token: string) {
  const res = await fetch(`${API_BASE_URL}/quiz/getMyQuiz`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data.quiz || null;
}

export async function getQuizById(token: string, quizId: string) {
  console.log("WOYYYYYY [SERVICE] getQuizById called with quizId:", quizId, "and token:", token );
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("kalo token doang : ",token ); 
  const res = await fetch(`${API_BASE_URL}/quizes/${quizId}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.quiz ;
}

export async function attemptQuiz(token: string, quizId: string, answers: Record<string, string>) {
  const res = await fetch(`${API_BASE_URL}/quiz/attempt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ quiz_id: quizId, answers }),
  });
  if (!res.ok) throw new Error("Gagal submit jawaban quiz");
  return res.json();
}

interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions: number;
  submitted_at: string;
  is_completed: boolean;
}

export async function getQuizAttempts(token: string, quizId?: string) {
  // Jika ada quizId, filter di frontend
  const url = `${API_BASE_URL}/quiz/attempts`;
  const res = await fetch(url, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil hasil quiz");
  const data = await res.json();
  if (quizId && data.attempts) {
    return { ...data, attempts: data.attempts.filter((a: QuizAttempt) => a.quiz_id === quizId) };
  }
  return data;
}

