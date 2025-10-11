"use client";
import { use, useState } from "react";
import { joinGroup } from "@/services/groupservices";

// Komponen join grup
export default function JoinGroupField({ token }: { token: string }) {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinGroup(inviteCode, token);
      setNotification("Berhasil join grup!");
      setInviteCode("");
      window.location.reload();
    } catch (err) {
      setNotification("Gagal join grup. Pastikan kode undangan benar.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 mb-8">
      <input
        type="text"
        className="border rounded px-3 py-2 text-sm w-full md:w-64"
        placeholder="Masukkan kode undangan grup..."
        value={inviteCode}
        onChange={e => setInviteCode(e.target.value)}
        disabled={loading}
      />
      <button
        className="bg-[#2563eb] text-white px-4 py-2 rounded font-semibold text-sm"
        onClick={handleJoin}
        disabled={loading || !inviteCode}
      >
        {loading ? "Memproses..." : "Join Grup"}
      </button>
      {notification && (
        <div className="text-sm text-green-600 ml-2">{notification}</div>
      )}
    </div>
  );
}