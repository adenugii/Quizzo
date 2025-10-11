"use client";
import { useEffect, useState } from "react";
import { getUserRecommendations, followUser } from "@/services/userservices";
import { getUserLeaderboard, getGroupLeaderboard } from "@/services/leaderboardservices";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const DUMMY_TRENDING = [
  { title: "React Hooks Deep Dive", attempts: 1234 },
  { title: "Python Data Science", attempts: 987 },
  { title: "CSS Grid & Flexbox", attempts: 756 },
];

// Ganti semua any dengan tipe spesifik
interface RecommendationUser {
  id: string;
  username: string;
  image_url?: string;
  follower_count?: number;
}
interface LeaderboardUser {
  username: string;
  xp: number;
  image_url?: string;
  rank?: number;
}
interface LeaderboardGroup {
  name: string;
  xp: number;
  group_name?: string;
  total_score?: number;
}

export default function SidebarSection({ token }: { token: string }) {
  const router = useRouter();
  const [rekomendasi, setRekomendasi] = useState<RecommendationUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState<string | null>(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardUser[]>([]);
  const [groupLeaderboard, setGroupLeaderboard] = useState<LeaderboardGroup[]>([]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getUserRecommendations(token).then((users) => {
      setRekomendasi(users);
      setLoading(false);
    });
    // Fetch leaderboard global
    getUserLeaderboard().then((res) => {
      setGlobalLeaderboard(res.leaderboard.slice(0, 5));
    });
    // Fetch leaderboard grup
    getGroupLeaderboard().then((res) => {
      setGroupLeaderboard(res.leaderboard.slice(0, 5));
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
          {globalLeaderboard.map((u, i) => (
            <div key={i} className={`flex items-center justify-between text-sm ${i===0 ? 'font-bold text-yellow-500' : ''}`}>
              <span>{u.username }</span>
              <span>{u.xp } XP</span>
            </div>
          ))}
        </div>
      </div>
      {/* Leaderboard Study Group */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-base text-gray-900">Leaderboard Study Group</h4>
        </div>
        <div className="flex flex-col gap-2">
          {groupLeaderboard.map((g, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{g.name || g.group_name}</span>
              <span>{g.xp || g.total_score} XP</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
