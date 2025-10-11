const API_BASE_URL = process.env.API_BASE_URL || "https://api.gilanghuda.my.id";

export async function likeQuizById(quizId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/socials/like/${quizId}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal like quiz");
  return await res.json();
}

export async function getCommentsByQuizId(quizId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/socials/comments/${quizId}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil komentar");
  return await res.json();
}

export async function postCommentByQuizId(quizId: string, content: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/socials/comment/${quizId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    cache: "no-store",
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Gagal mengirim komentar");
  return await res.json();
}
