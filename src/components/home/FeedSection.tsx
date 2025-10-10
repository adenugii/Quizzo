"use client";
import { useState, useEffect } from "react";
import { getFeed, getUserById } from "@/services/userservices";
import Image from "next/image";
import Link from "next/link";

interface FeedItem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  done?: number;
  author?: string;
  liked?: boolean;
  popular?: number;
  created_by: string;
}

export default function FeedSection({ token }: { token: string }) {
  const [filter, setFilter] = useState<'terbaru' | 'populer' | 'kesulitan'>('terbaru');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [userMap, setUserMap] = useState<Record<string, { username?: string; image_url?: { String: string; Valid: boolean } }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      const data = await getFeed(token);
      setFeed(data);
      // Ambil semua user unik dari feed
      const userIds = Array.from(new Set(data.map((q: FeedItem) => q.created_by))) as string[];
      const userMapTemp: Record<string, { username?: string; image_url?: { String: string; Valid: boolean } }> = {};
      await Promise.all(userIds.map(async (id: string) => {
        const user = await getUserById(id, token);
        if (user) userMapTemp[id] = user;
      }));
      setUserMap(userMapTemp);
      setLoading(false);
    }
    fetchFeed();
  }, [token]);

  const filteredFeed = [...feed];
  if (filter === 'populer') filteredFeed.sort((a, b) => (b.popular || 0) - (a.popular || 0));
  if (filter === 'kesulitan') filteredFeed.sort((a, b) => (a.difficulty || '').localeCompare(b.difficulty || ''));

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-gray-900">Quiz dari Orang yang Kamu Follow</h3>
        <div className="flex gap-2">
          <button onClick={() => setFilter('terbaru')} className={`px-3 py-1 rounded-full text-xs font-semibold ${filter==='terbaru' ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-700'}`}>Terbaru</button>
          <button onClick={() => setFilter('populer')} className={`px-3 py-1 rounded-full text-xs font-semibold ${filter==='populer' ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-700'}`}>Populer</button>
          <button onClick={() => setFilter('kesulitan')} className={`px-3 py-1 rounded-full text-xs font-semibold ${filter==='kesulitan' ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-700'}`}>Kesulitan</button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : filteredFeed.length === 0 ? (
          <div className="text-gray-400">Belum ada quiz dari orang yang kamu follow.</div>
        ) : (
          filteredFeed.map((item) => {
            const user = userMap[item.created_by] || {};
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.difficulty==='easy' ? 'bg-green-100 text-green-600' : item.difficulty==='medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>{item.difficulty ? item.difficulty.charAt(0).toUpperCase()+item.difficulty.slice(1) : '-'}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.done || 0} selesai</span>
                </div>
                <div className="font-semibold text-gray-900 text-base">{item.title}</div>
                <div className="text-sm text-gray-500 mb-1">{item.description}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Image src={user.image_url?.String || "/profile.png"} alt={user.username || "-"} width={24} height={24} className="rounded-full object-cover" />
                  <span>{user.username || '-'}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <Link href={`/quiz-maker/${item.id}`}>
                      <button className="ml-2 px-3 py-1 rounded bg-[#2563eb] text-white font-semibold">Kerjakan Quiz</button>
                    </Link>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
