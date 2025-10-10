/* eslint-disable prefer-const */
"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { followUser } from "@/services/userservices";

interface AccountUser {
  id: string;
  username: string;
  email: string;
  follower_count: number;
}

export default function AccountRecommendation({ users, token }: { users: AccountUser[]; token: string }) {
  const [cards, setCards] = useState<{ user: AccountUser; status: string }[]>(users.map((user) => ({ user, status: "idle" })));
  const [followed, setFollowed] = useState<AccountUser[]>([]);
  const [search, setSearch] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);
  const router = useRouter();

  console.log("[CLIENT COMPONENT] Token rekomendasi-akun:", token, typeof token);

  const filteredCards = useMemo(() => {
    if (!search) return cards;
    return cards.filter(
      (c) =>
        c.user.username.toLowerCase().includes(search.toLowerCase()) ||
        c.user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, cards]);

  const handleFollow = async (userId: string) => {
    setLoadingFollow(userId);
    setCards((prev) =>
      prev.map((c) =>
        c.user.id === userId ? { ...c, status: "following" } : c
      )
    );
    try {
      await followUser(token, userId);
    } catch (err) {
      // handle error if needed
    }
    setTimeout(() => {
      setCards((prev) => {
        const idx = prev.findIndex((c) => c.user.id === userId);
        if (idx === -1) return prev;
        // Ganti let newCards menjadi const newCards
        const newCards = [...prev];
        newCards[idx] = { ...newCards[idx], status: "removing" };
        return newCards;
      });
      setTimeout(() => {
        setCards((prev) => {
          const idx = prev.findIndex((c) => c.user.id === userId);
          if (idx === -1) return prev;
          const newCards = [...prev];
          newCards.splice(idx, 1);
          return newCards;
        });
        const user = cards.find((c) => c.user.id === userId)?.user;
        if (user) setFollowed((prev) => [...prev, user]);
        setLoadingFollow(null);
      }, 350);
    }, 900);
  };

  const handleNext = () => {
    setShowSuccess(true);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#eaf1ff]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
          <div className="mb-2 flex items-center gap-2 text-xl font-semibold">
            <span>✨</span>
            <span>Rekomendasi Akun untuk Kamu</span>
          </div>
          <div className="text-gray-500 text-sm mb-4">
            Ikuti minimal 5 akun agar pengalaman belajarmu lebih seru.
          </div>
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Cari akun lain"
              className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {filteredCards.map((card, idx) => (
              <div
                key={card.user.id}
                className={`
                  bg-[#f8fafc] rounded-xl p-4 flex flex-col items-center
                  shadow-lg border border-gray-100 relative
                  transition-all duration-300
                  ${card.status === "removing" ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}
                  ${card.status === "following" ? "ring-2 ring-[#2563eb]/30" : ""}
                `}
                style={{ minHeight: 220 }}
              >
                <Image
                  src={"/profile-demo.jpg"}
                  alt={card.user.username}
                  width={56}
                  height={56}
                  className="rounded-full mb-2 object-cover"
                />
                <div className="font-semibold text-gray-800">{card.user.username}</div>
                <span
                  className={`text-xs px-2 py-1 rounded-full mt-1 mb-3 text-white bg-[#2563eb]`}
                >
                  {card.user.follower_count} Followers
                </span>
                {card.status === "following" ? (
                  <button
                    className="w-full bg-green-400 text-white rounded-md py-2 font-semibold transition-all duration-300 cursor-default"
                    disabled
                  >
                    <span className="animate-pulse">Followed</span>
                  </button>
                ) : (
                  <button
                    className="w-full bg-[#2563eb] text-white rounded-md py-2 font-semibold hover:bg-[#174bbd] transition"
                    onClick={() => handleFollow(card.user.id)}
                    disabled={
                      followed.some((u) => u.id === card.user.id) ||
                      card.status !== "idle" ||
                      loadingFollow !== null
                    }
                  >
                    {loadingFollow === card.user.id ? "Loading..." : "+ Follow"}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mb-2 text-sm text-gray-700 flex justify-between">
            {followed.length >= 5 ? (
              <span className="font-bold text-green-600">
                Anda sudah mengikuti {followed.length} orang
              </span>
            ) : (
              <>
                <span>Sudah mengikuti:</span>
                <span className="font-bold text-[#2563eb]">{followed.length}/5 akun</span>
              </>
            )}
          </div>
          <div className="w-full h-2 bg-gray-100 rounded mb-4 overflow-hidden">
            <div
              className={`h-full transition-all ${followed.length >= 5 ? "bg-green-500" : "bg-[#2563eb]"}`}
              style={{
                width: followed.length >= 5
                  ? "100%"
                  : `${(followed.length / 5) * 100}%`
              }}
            />
          </div>
          <button
            className={`w-full rounded-md py-2 font-semibold transition ${
              followed.length >= 5
                ? "bg-[#2563eb] text-white hover:bg-[#174bbd] cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={followed.length < 5}
            onClick={handleNext}
          >
            Selanjutnya
          </button>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-lg mb-2 text-center">Selamat!</div>
            <div className="text-gray-600 text-center mb-4">
              Anda telah berhasil membuat akun.
            </div>
            <button
              className="w-full bg-[#2563eb] text-white rounded-md py-2 font-semibold hover:bg-[#174bbd] transition"
              onClick={() => window.location.href = "/"}
            >
              Lanjut ke Beranda
            </button>
          </div>
        </div>
      )}
    </>
  );
}

