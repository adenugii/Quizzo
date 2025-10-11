// Cek apakah kode sedang berjalan di server atau di client.
const IS_SERVER = typeof window === 'undefined';
const SERVER_URL = process.env.APP_URL || 'http://localhost:3000';
const CLIENT_PATH = ''; 
// Arahkan semua panggilan ke proxy lokal
const API_BASE_URL = `${IS_SERVER ? SERVER_URL : CLIENT_PATH}/api`;

// Wrapper "pintar" untuk fetch yang terotentikasi.
async function fetchAuthenticated(url: string, options: RequestInit = {}, token?: string) {
  const headers = new Headers(options.headers || {});
  // Jangan set Content-Type untuk FormData, browser akan melakukannya
  if (!options.body || !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Cookie", `token=${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: token ? undefined : "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || "An error occurred");
    } catch (e) {
      throw new Error(errorText || "An unknown error occurred");
    }
  }
  
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// Fungsi getMyQuiz yang sudah diadaptasi untuk proxy
export async function getMyQuiz(token?: string) {
  const result = await fetchAuthenticated(`${API_BASE_URL}/quiz/getMyQuiz`, {
    method: "GET",
  }, token);
  return result.quiz || null; // Kembalikan array kuisnya
}

// Fungsi BARU untuk menambahkan kuis ke grup
export async function addQuizToGroup(groupId: string, quizId: string, token?: string) {
    return fetchAuthenticated(`${API_BASE_URL}/study-group/${groupId}/add-quiz`, {
        method: "POST",
        body: JSON.stringify({ quiz_id: quizId }),
    }, token);
}

// Fungsi uploadQuiz yang sudah diadaptasi untuk proxy
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

  return fetchAuthenticated(`${API_BASE_URL}/quiz/upload`, {
    method: "POST",
    body: formData,
  }, token);
}

// Fungsi lainnya diadaptasi untuk menggunakan proxy dan wrapper
export async function getQuizById(quizId: string, token?: string) {
  const result = await fetchAuthenticated(`${API_BASE_URL}/quizes/${quizId}`, {
    method: "GET",
  }, token);
  return result.quiz;
}

export async function attemptQuiz(token: string, quizId: string, answers: Record<string, string>) {
  return fetchAuthenticated(`${API_BASE_URL}/quiz/attempt`, {
    method: "POST",
    body: JSON.stringify({ quiz_id: quizId, answers }),
  }, token);
}