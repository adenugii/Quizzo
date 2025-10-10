"use client";
import { useEffect, useState } from "react";
import { getUserRecommendations, followUser } from "@/services/userservices";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DUMMY_TRENDING = [
  { title: "React Hooks Deep Dive", attempts: 1234 },
  { title: "Python Data Science", attempts: 987 },
  { title: "CSS Grid & Flexbox", attempts: 756 },
];

const DUMMY_GLOBAL_LEADERBOARD = [
  { name: "Sarah Wilson", xp: 4810 },
  { name: "Mike Chen", xp: 4320 },
  { name: "Ahmad Rizki (You)", xp: 3450 },
  { name: "Lisa Park", xp: 3200 },
  { name: "David Kim", xp: 2100 },
];

const DUMMY_GROUP_LEADERBOARD = [
  { name: "Matematika Dasar", xp: 4850, members: 15 },
  { name: "Fisika Terapan", xp: 3900, members: 10 },
  { name: "Kimia SMA", xp: 3200, members: 12 },
  { name: "Bismillah", xp: 2800, members: 8 },
];

// Ganti semua any dengan tipe spesifik
interface RecommendationUser {
  id: string;
  username: string;
  image_url?: string;
  follower_count?: number;
}

export default function SidebarSection({ token }: { token: string }) {
  const router = useRouter();
  const [rekomendasi, setRekomendasi] = useState<RecommendationUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getUserRecommendations(token).then((users) => {
      setRekomendasi(users);
      setLoading(false);
    });
  }, [token]);

  const handleFollow = async (userId: string) => {
    setLoadingFollow(userId);
    try {
      await followUser(token, userId);
      // Refresh rekomendasi setelah follow
      const users = await getUserRecommendations(token);
      setRekomendasi(users);
    } catch {}
    setLoadingFollow(null);
  };

  return (
    <aside className="flex flex-col gap-6 w-full md:w-80">
      {/* Rekomendasi Follow */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h4 className="font-bold text-base text-gray-900 mb-3">Rekomendasi Follow</h4>
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : rekomendasi.length === 0 ? (
            <div className="text-gray-400">Tidak ada rekomendasi akun.</div>
          ) : (
            rekomendasi.map((r: RecommendationUser) => (
              <div key={r.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src={r.image_url || "/profile.png"} alt={r.username} width={32} height={32} className="rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{r.username}</div>
                    <div className="text-xs text-gray-400">{r.follower_count} Followers</div>
                  </div>
                </div>
                <button
                  className={`bg-[#2563eb] text-white text-xs font-semibold px-3 py-1 rounded-full ${loadingFollow === r.id ? "opacity-50" : ""}`}
                  onClick={() => handleFollow(r.id)}
                  disabled={loadingFollow === r.id}
                >
                  {loadingFollow === r.id ? "Loading..." : "+ Follow"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Quiz Trending */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h4 className="font-bold text-base text-gray-900 mb-3">Quiz Trending</h4>
        <div className="flex flex-col gap-2">
          {DUMMY_TRENDING.map((q, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{q.title}</span>
              <span className="text-xs text-gray-400">{q.attempts} attempts</span>
            </div>
          ))}
        </div>
      </div>
      {/* Global Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-base text-gray-900">Global Leaderboard</h4>
          <button className="text-xs text-[#2563eb] font-semibold" onClick={()=>router.push("/leaderboard")}>View All</button>
        </div>
        <div className="flex flex-col gap-2">
          {DUMMY_GLOBAL_LEADERBOARD.map((u, i) => (
            <div key={i} className={`flex items-center justify-between text-sm ${i===0 ? 'font-bold text-yellow-500' : ''}`}>
              <span>{u.name}</span>
              <span>{u.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
      {/* Leaderboard Study Group */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-base text-gray-900">Leaderboard Study Group</h4>
          <form method="GET" action="/leaderboard-group">
            <button type="submit" className="text-xs text-[#2563eb] font-semibold">View All</button>
          </form>
        </div>
        <div className="flex flex-col gap-2">
          {DUMMY_GROUP_LEADERBOARD.map((g, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{g.name}</span>
              <span>{g.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
