"use client";
import { useEffect, useState } from "react";
import { MdLeaderboard } from "react-icons/md";
import { getUserLeaderboard } from "@/services/leaderboardservices";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface LeaderboardUser {
  rank?: number;
  username?: string;
  name?: string;
  xp?: number;
  total_score?: number;
  image_url?: string;
}

export default function ProfileLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    getUserLeaderboard().then((res) => {
      setLeaderboard(res.leaderboard.slice(0, 5));
    });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-lg text-gray-900 flex-1">
          Global Leaderboard
        </h3>
        <span className="text-yellow-400 text-xl">
          <MdLeaderboard />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {leaderboard.map((u, i) => (
          <div key={i} className={`flex items-center gap-3 ${i===0 ? 'bg-yellow-50' : i===2 ? 'bg-blue-50 border border-blue-200' : ''} rounded-lg px-3 py-2`}>
            <span className={`font-bold text-base w-5 text-center ${i===0 ? 'text-yellow-500' : i===2 ? 'text-blue-500' : 'text-gray-400'}`}>{u.rank || i+1}</span>
            <Image src={u.image_url || "/profile.png"} alt={u.username || u.name || "Profile Image"} width={32} height={32} className="rounded-full object-cover" />
            <div className="flex-1">
              <div className={`font-semibold text-sm ${i===2 ? 'text-[#2563eb]' : 'text-gray-900'}`}>{u.username || u.name}{i===2 ? ' (You)' : ''}</div>
              <div className="text-xs text-gray-400">{u.xp || u.total_score} XP</div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 rounded-md bg-[#2563eb] text-white font-semibold text-base shadow hover:bg-[#1e40af] transition" onClick={()=>router.push("/leaderboard")}>View Full Leaderboard</button>
    </div>
  );
}