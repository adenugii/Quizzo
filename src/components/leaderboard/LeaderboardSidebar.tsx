import { FaTrophy, FaFire, FaStar, FaBolt } from "react-icons/fa";

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

export default function LeaderboardSidebar({ leaderboardData, groupLeaderboardData }: { leaderboardData: { leaderboard: LeaderboardUser[] }, groupLeaderboardData: { leaderboard: LeaderboardGroup[] } }) {
  return (
    <aside className="w-full md:w-[300px] flex-shrink-0 flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center mb-2">
        <img
          src="/profile.png"
          alt="Rafiananta"
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 mb-2"
        />
        <div className="font-bold text-lg text-gray-900">Rafiananta</div>
        <div className="text-gray-500 text-sm mb-3">Level 1</div>
        <div className="w-full mb-1">
          <div className="flex justify-between text-xs text-gray-400 mb-0.5">
            <span>XP Progress</span>
            <span className="text-[#2563eb] font-bold">350/500</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-2 bg-[#2563eb] rounded-full" style={{ width: "70%" }} />
          </div>
          <div className="text-xs text-gray-400 mt-1">150 XP menuju Level 2</div>
        </div>
        <div className="w-full mt-4">
          <div className="text-xs font-semibold text-gray-700 mb-2">Badge Collection</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-yellow-100 p-2 rounded-lg"><FaTrophy className="text-yellow-400" /></span>
            <span className="bg-blue-100 p-2 rounded-lg"><FaFire className="text-blue-500" /></span>
            <span className="bg-purple-100 p-2 rounded-lg"><FaStar className="text-purple-500" /></span>
            <span className="bg-green-100 p-2 rounded-lg"><FaBolt className="text-green-500" /></span>
            <span className="bg-blue-100 p-2 rounded-lg flex items-center gap-1">
              <FaStar className="text-blue-500" />
              <span className="text-xs font-bold text-blue-500">Baru</span>
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Global Rank</span>
          <span className="font-bold text-[#2563eb]">#247</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Quizzes Completed</span>
          <span className="font-bold text-green-500">127</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Quizzes Inprogress</span>
          <span className="font-bold text-purple-500">87</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Quizzes Not Started</span>
          <span className="font-bold text-red-400">43</span>
        </div>
      </div>
    </aside>
  );
}