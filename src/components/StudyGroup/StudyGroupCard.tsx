"use client";

import { FaCalculator, FaAtom } from "react-icons/fa";
import { PiBookOpenTextFill } from "react-icons/pi";
import { HiUsers } from "react-icons/hi2";
import { MdOutlineBarChart } from "react-icons/md";
import { useRouter } from "next/navigation";
import { joinGroup } from "@/services/groupservices";
import { useState } from "react";

// Tipe untuk state notifikasi
type Notification = {
  type: "success" | "error";
  message: string;
  description?: string;
};

export interface StudyGroupCardProps {
  id: string;
  title: string;
  desc: string;
  members: number;
  quizDone: number;
  quizTotal: number;
  progress: number;
  icon: "math" | "physics" | "english";
  inviteCode: string;
  token?: string;
}

export default function StudyGroupCard({
  id,
  title,
  desc,
  members,
  quizDone,
  quizTotal,
  progress,
  icon,
  inviteCode,
  token,
}: StudyGroupCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // 1. Tambahkan state untuk mengontrol notifikasi (mirip seperti di LoginPage)
  const [notification, setNotification] = useState<Notification | null>(null);

  const iconMap = {
    math: <FaCalculator className="text-[#2563eb] text-lg" />,
    physics: <FaAtom className="text-[#2563eb] text-lg" />,
    english: <PiBookOpenTextFill className="text-[#2563eb] text-lg" />,
  };

  const handleJoin = async () => {
    setLoading(true);
    if (!token) {
      setNotification({
        type: "error",
        message: "Aksi Gagal",
        description: "Anda harus login terlebih dahulu untuk bergabung.",
      });
      setLoading(false);
      return;
    }

    try {
      
      
    

      // Pindahkan ke halaman detail setelah jeda
      setTimeout(() => {
        router.push(`/group-detail?id=${id}`);
        router.refresh();
      }, 1500); // Jeda 1.5 detik

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Silakan coba lagi nanti.";
      // 3. Tampilkan notifikasi error
      setNotification({
        type: "error",
        message: "Gagal Masuk Grup",
        description: errorMessage,
      });
      setLoading(false); // Hentikan loading hanya jika gagal
    }
  };

  return (
    // Gunakan React Fragment agar bisa merender card dan notifikasi
    <>
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex flex-col gap-3 relative">
        {/* ... sisa kode JSX untuk card tidak berubah ... */}
        <div className="absolute top-4 right-4">{iconMap[icon]}</div>
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
        <div className="flex items-center gap-4 text-xs text-gray-700 mt-1">
          <span className="flex items-center gap-1"><HiUsers className="text-base" />{members} anggota</span>
          <span className="flex items-center gap-1"><MdOutlineBarChart className="text-base" />{quizTotal} quiz</span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1 mt-2">
            <span className="text-xs text-gray-500">Progress Quiz</span>
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 rounded-full bg-[#2563eb] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button
          className="w-full py-2 rounded-md bg-[#2563eb] text-white font-semibold text-base shadow hover:bg-[#1e40af] transition mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleJoin}
          disabled={loading || !token}
        >
          {loading ? "Memproses..." : "Lihat Group"}
        </button>
      </div>

      {/* 4. Render notifikasi secara kondisional (mirip seperti di LoginPage) */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center text-center">
            <div className="text-3xl mb-3">
              {notification.type === "success" ? "✅" : "❌"}
            </div>
            <div className="font-bold text-lg mb-2 text-gray-900">
              {notification.message}
            </div>
            {notification.description && (
              <div className="text-gray-600 mb-4">
                {notification.description}
              </div>
            )}
            {/* Tampilkan tombol tutup hanya untuk notifikasi error */}
            {notification.type === "error" && (
              <button
                onClick={() => setNotification(null)}
                className="w-full py-2 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}