"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginAuthLayout from "@/components/auth/LoginAuthLayout";
import { signin, signInWithGoogle } from "@/services/authservices";
import Cookies from "js-cookie";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "510376724757-a4nrnaqp89rjkf0q8iu2arsn18u1te5r.apps.googleusercontent.com";

export default function LoginPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Login manual handler
  const handleLogin = async ({
    email,
    password,
    rememberMe,
    setError,
    setLoading,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
    setError: (msg: string | null) => void;
    setLoading: (v: boolean) => void;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signin({ email, password });

      Cookies.set("token", data.token, {
        expires: rememberMe ? 7 : undefined,
        path: "/",
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      if (data.user?.username) {
        Cookies.set("username", data.user.username);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/rekomendasi");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login handler
  const handleGoogleLogin = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) throw new Error("Token Google tidak ditemukan");

      const data = await signInWithGoogle(id_token);

      if (data.user?.username) {
        Cookies.set("username", data.user.username);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/rekomendasi");
      }, 1200);
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Gagal login dengan Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginAuthLayout onLogin={handleLogin} />
      <div className="flex flex-col items-center mt-4">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Gagal login dengan Google")}
          width="300"
          useOneTap={false}
        />
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      </div>

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-bold text-lg mb-2 text-center">
              Login Berhasil!
            </div>
            <div className="text-gray-600 text-center mb-2">
              Anda akan diarahkan ke halaman utama...
            </div>
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
}
