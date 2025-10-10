/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FaMedal, FaTrophy } from "react-icons/fa";

interface Group {
  name: string;
  icon: string;
  bg: string;
  members: number;
  completed: number;
  xp: number;
  trend: number;
  isYou?: boolean;
  member_count?: number;
  total_score?: number;
}

interface LeaderboardGroupProps {
  groups: Group[];
  page: number;
  setPage: (page: number) => void;
}

export default function LeaderboardGroup({ groups, page, setPage }: LeaderboardGroupProps) {
  return (
    <div className="p-6">
      <div className="flex justify-end mb-2">
        <button className="bg-[#2563eb] text-white font-semibold px-4 py-1.5 rounded-lg text-sm shadow hover:bg-[#1e40af] transition">
          Your Group
        </button>
      </div>
      <div className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
        <FaTrophy className="text-yellow-400" />
        Global Leaderboard <span className="font-normal text-gray-400 text-sm">(Top 50 Group)</span>
      </div>
      <div className="flex flex-col gap-2">
        {groups.map((group, idx) => (
          <div
            key={group.name + idx}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition ${
              idx === 0
                ? "bg-yellow-50 border-yellow-200"
                : idx === 2
                ? "bg-purple-50 border-purple-200"
                : idx === 1
                ? "bg-blue-50 border-blue-200"
                : group.isYou
                ? "bg-blue-50 border-blue-500"
                : "border-transparent"
            }`}
          >
            <span
              className={`font-bold text-base w-8 text-center ${
                idx === 0
                  ? "text-yellow-500"
                  : idx === 1
                  ? "text-blue-500"
                  : idx === 2
                  ? "text-purple-500"
                  : "text-gray-400"
              }`}
            >
              #{idx + 1}
            </span>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold bg-gray-100">
              <FaMedal className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <div
                className={`font-semibold text-gray-900 text-base ${
                  group.isYou ? "text-[#2563eb]" : ""
                }`}
              >
                {group.name}
                {group.isYou && (
                  <span className="ml-2 text-xs font-bold text-[#2563eb]">(Your Group)</span>
                )}
              </div>
              <div className="text-xs text-gray-400">{group.member_count ?? 0} members</div>
              <div className="text-xs text-gray-400">
                Completed {group.completed} group quizzes
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`font-bold text-base ${
                  idx === 0
                    ? "text-yellow-600"
                    : idx === 1
                    ? "text-blue-600"
                    : idx === 2
                    ? "text-purple-600"
                    : "text-gray-700"
                }`}
              >
                {(group.total_score ?? 0).toLocaleString("en-US")} XP
              </span>
              <span className={`text-xs mt-1 ${group.trend > 0 ? "text-green-500" : "text-red-500"}`}>
                {group.trend > 0 ? `↑ +${group.trend.toLocaleString("en-US")}` : `↓ ${Math.abs(group.trend).toLocaleString("en-US")}`} this week
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        <button
          className="px-3 py-1 rounded bg-gray-100 text-gray-500 font-semibold disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`px-3 py-1 rounded ${
              page === p
                ? "bg-[#2563eb] text-white font-bold"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-100 text-gray-500 font-semibold disabled:opacity-50"
          disabled={page === 3}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}