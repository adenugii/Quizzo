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
  const res = await fetch(`${API_BASE_URL}/signup`, {
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
  const res = await fetch(`${API_BASE_URL}/signin`, {
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

export async function signInWithGoogle(id_token: string) {
  const res = await fetch(`${API_BASE_URL}/signin/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token }),
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  console.log("Google signin response:", data);
  if (!res.ok) {
    throw new Error(data?.message || "Gagal login dengan Google");
  }
  // Simpan token di cookie agar tetap ada setelah refresh
  if (data.token) {
    Cookies.set("token", data.token, {
      expires: 7,
      path: "/",
      sameSite: "Lax",
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
