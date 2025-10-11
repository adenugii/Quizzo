/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getProfile } from "@/services/userservices";

export default function ProfileCard({ user }: { user: any }) {
  if (!user) {
    return (
      <section className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-6 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      </section>
    );
  }

  // Ambil exp_point sebagai number
  let exp = 0;
  if (typeof user.exp_point === "object" && user.exp_point !== null && "String" in user.exp_point) {
    exp = Number(user.exp_point.String) || 0;
  } else if (typeof user.exp_point === "string" || typeof user.exp_point === "number") {
    exp = Number(user.exp_point) || 0;
  }
  // Hitung level: kelipatan 5, dst sampai lvl 15
  let level = 1;
  const levelThresholds = [5, 15, 30, 50, 75, 105, 140, 180, 225, 275, 330, 390, 455, 525, 600];
  for (let i = 0; i < levelThresholds.length; i++) {
    if (exp > levelThresholds[i]) level = i + 2;
  }
  // Ambil image url
  let imageUrl = "/profile.png";
  if (user.image_url) {
    if (typeof user.image_url === "object" && "String" in user.image_url && user.image_url.String) imageUrl = user.image_url.String;
    else if (typeof user.image_url === "string" && user.image_url) imageUrl = user.image_url;
  }

  // Hitung target XP untuk level berikutnya
  const nextLevelThreshold = levelThresholds[level - 1] || 3000;
  const expPercent = Math.min(100, (exp / nextLevelThreshold) * 100);

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-6">
      <div>
        <img
          src={imageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
        />
      </div>
      <div className="flex-1">
        <h2 className="font-bold text-xl text-gray-900 mb-1">
          {user.username} <span className="ml-2 text-xs bg-[#2563eb] text-white px-2 py-0.5 rounded-full align-middle">Lv. {level}</span>
        </h2>
        <div className="text-gray-500 text-sm mb-2">
          {user.email}
        </div>
        <div className="flex items-center gap-2 mb-1">
         
    
        </div>
        <div className="flex gap-4 text-xs text-gray-600 mb-2">
          <span><b>{user.follower_count ?? 0}</b> Followers</span>
          <span><b>{user.following_count ?? 0}</b> Following</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-[#2563eb] rounded-full transition-all duration-300"
            style={{ width: `${expPercent}%` }}
          />
        </div>
        <div className="flex justify-end text-xs text-[#2563eb] font-semibold mt-1">
          {exp} / {nextLevelThreshold} XP
        </div>
      </div>
    </section>
  );
}