const API_BASE_URL = process.env.API_BASE_URL || "https://api.gilanghuda.my.id";

export async function getProfile(token?: string) {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    headers: token ? { Cookie: `token=${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function getUserRecommendations(token?: string) {
  const res = await fetch(`${API_BASE_URL}/user/recommendations`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.recommendations || [];
}

export async function followUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/user/follow/${userId}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Gagal follow user");
  }
  return await res.json();
}

export async function getFeed(token?: string) {
  const res = await fetch(`${API_BASE_URL}/quiz/feed`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.feed || [];
}

export async function getUserById(userId: string, token?: string) {
  const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  return await res.json();
}

