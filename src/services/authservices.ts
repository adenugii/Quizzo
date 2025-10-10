const API_BASE_URL = process.env.API_BASE_URL || "https://api.gilanghuda.my.id";
import Cookies from "js-cookie";

export async function signup({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) {
  // call internal API route (same-origin) to avoid CORS
  const res = await fetch(`/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Gagal mendaftar");
  }

  return res.json();
}

export async function signin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // call internal API route (same-origin) to avoid CORS
  const res = await fetch(`/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Gagal login");
  }
  // Simpan token di cookie agar tetap ada setelah refresh
  if (data.token) {
    Cookies.set("token", data.token, {
      expires: 7,
      path: "/",
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return data;
}

export function logout() {
  Cookies.remove("token");
  Cookies.remove("username");
  Cookies.remove("api_token");
  sessionStorage.removeItem("token");
}
