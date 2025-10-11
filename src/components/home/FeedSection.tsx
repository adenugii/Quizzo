"use client";
import { useState, useEffect } from "react";
import { getFeed, getUserById } from "@/services/userservices";
import { likeQuizById, getCommentsByQuizId, postCommentByQuizId } from "@/services/socialservices";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart, FaRegCommentDots } from "react-icons/fa";

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
  attempts?: number;
  is_likedbyme?: boolean;
  likes_count?: number;
}

interface Comment {
  id: string;
  quiz_id: string;
  content: string;
  commenter_by: string;
  created_at: string;
}

export default function FeedSection({ token }: { token: string }) {
  const [filter, setFilter] = useState<'terbaru' | 'populer' | 'kesulitan'>('terbaru');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [userMap, setUserMap] = useState<Record<string, { username?: string; image_url?: { String: string; Valid: boolean } }>>({});
  const [loading, setLoading] = useState(true);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});
  const [commentModalQuizId, setCommentModalQuizId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [userCommentMap, setUserCommentMap] = useState<Record<string, { username?: string }>>({});

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      const data = await getFeed(token);
      setFeed(data);
      // Ambil semua user unik dari feed
      const userIds = Array.from(new Set(data.map((q: FeedItem) => q.created_by)));
      const userMapTemp: Record<string, { username?: string; image_url?: { String: string; Valid: boolean } }> = {};
      await Promise.all(userIds.map(async (id) => {
        const userId = String(id);
        const user = await getUserById(userId, token);
        if (user) userMapTemp[userId] = user;
      }));
      setUserMap(userMapTemp);
      // Fetch 3 komentar terbaru untuk setiap quiz
      const commentsTemp: Record<string, Comment[]> = {};
      const commenterIds = new Set<string>();
      await Promise.all(data.map(async (item: FeedItem) => {
        try {
          const res = await getCommentsByQuizId(item.id, token);
          commentsTemp[item.id] = (res.comments || []).slice(0, 3);
          (res.comments || []).slice(0, 3).forEach((c: Comment) => commenterIds.add(c.commenter_by));
        } catch {
          commentsTemp[item.id] = [];
        }
      }));
      setCommentsMap(commentsTemp);
      // Fetch username untuk semua commenter_by
      const userCommentMapTemp: Record<string, { username?: string }> = {};
      await Promise.all(Array.from(commenterIds).map(async (id: string) => {
        if (!userCommentMapTemp[id]) {
          const user = await getUserById(id, token);
          if (user) userCommentMapTemp[id] = { username: user.username };
        }
      }));
      setUserCommentMap(userCommentMapTemp);
      setLoading(false);
    }
    fetchFeed();
  }, [token]);

  const handleLike = async (quizId: string) => {
    setLikeLoading(quizId);
    try {
      await likeQuizById(quizId, token);
      // Refresh feed
      const data = await getFeed(token);
      setFeed(data);
    } catch {}
    setLikeLoading(null);
  };

  const handleOpenComments = async (quizId: string) => {
    setCommentModalQuizId(quizId);
    setCommentInput("");
    // Fetch all comments for modal
    try {
      const res = await getCommentsByQuizId(quizId, token);
      setCommentsMap((prev) => ({ ...prev, [quizId]: res.comments || [] }));
      // Fetch username untuk semua commenter_by di modal
      const userCommentMapTemp: Record<string, { username?: string }> = { ...userCommentMap };
      await Promise.all((res.comments || []).map(async (c: Comment) => {
        if (!userCommentMapTemp[c.commenter_by]) {
          const user = await getUserById(c.commenter_by, token);
          if (user) userCommentMapTemp[c.commenter_by] = { username: user.username };
        }
      }));
      setUserCommentMap(userCommentMapTemp);
    } catch {}
  };

  const handlePostComment = async (quizId: string) => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      await postCommentByQuizId(quizId, commentInput, token);
      setCommentInput("");
      // Refresh comments
      const res = await getCommentsByQuizId(quizId, token);
      setCommentsMap((prev) => ({ ...prev, [quizId]: res.comments || [] }));
    } catch {}
    setCommentLoading(false);
  };

  function formatCommentTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      // Today: show hour:minute
      return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    } else {
      // Not today: show day month
      return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    }
  }

  const filteredFeed = [...feed];
  if (filter === 'populer') filteredFeed.sort((a, b) => (b.attempts || 0) - (a.attempts || 0));
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
            const comments = commentsMap[item.id] || [];
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.difficulty==='easy' ? 'bg-green-100 text-green-600' : item.difficulty==='medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>{item.difficulty ? item.difficulty.charAt(0).toUpperCase()+item.difficulty.slice(1) : '-'}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.attempts || 0} orang sudah mengerjakan</span>
                </div>
                <div className="font-semibold text-gray-900 text-base">{item.title}</div>
                <div className="text-sm text-gray-500 mb-1">{item.description}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Image src={user.image_url?.String || "/profile.png"} alt={user.username || "-"} width={24} height={24} className="rounded-full object-cover" />
                  <span>{user.username || '-'}</span>
                  <span className="ml-auto flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                      disabled={likeLoading === item.id}
                      onClick={() => handleLike(item.id)}
                    >
                      {item.is_likedbyme ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
                      <span>{item.likes_count || 0}</span>
                    </button>
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
                      onClick={() => handleOpenComments(item.id)}
                    >
                      <FaRegCommentDots className="text-gray-400" />
                      <span>Komentar</span>
                    </button>
                    <Link href={`/quiz-maker/${item.id}`}>
                      <button className="ml-2 px-3 py-1 rounded bg-[#2563eb] text-white font-semibold">Kerjakan Quiz</button>
                    </Link>
                  </span>
                </div>
                {/* 3 komentar terbaru */}
                {comments.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1">
                    {comments.slice(0, 3).map((c, idx) => (
                      <div key={c.id || idx} className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1 flex items-center gap-2">
                        <span className="font-semibold">{userCommentMap[c.commenter_by]?.username || '-'}:</span> {c.content}
                        <span className="text-gray-400 ml-auto">{formatCommentTime(c.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Modal komentar */}
                {commentModalQuizId === item.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
                    <div className="bg-white w-full max-w-md rounded-2xl p-4 max-h-[80vh] flex flex-col shadow-xl relative">
                      {/* Sticky detail quiz */}
                      <div className="sticky top-0 bg-white pb-2 z-10 border-b mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${item.difficulty==='easy' ? 'bg-green-100 text-green-600' : item.difficulty==='medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>{item.difficulty ? item.difficulty.charAt(0).toUpperCase()+item.difficulty.slice(1) : '-'}</span>
                          <span className="text-xs text-gray-400 ml-2">{item.attempts || 0} orang sudah mengerjakan</span>
                        </div>
                        <div className="font-semibold text-gray-900 text-base">{item.title}</div>
                        <div className="text-sm text-gray-500 mb-1">{item.description}</div>
                        <button onClick={() => setCommentModalQuizId(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">Tutup</button>
                      </div>
                      {/* Komentar scrollable */}
                      <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-2 mt-2">
                        {(commentsMap[item.id] || []).map((c, idx) => (
                          <div key={c.id || idx} className="text-xs text-gray-700 bg-gray-50 rounded px-2 py-1 flex items-center gap-2">
                            <span className="font-semibold">{userCommentMap[c.commenter_by]?.username || '-'}:</span> {c.content}
                            <span className="text-gray-400 ml-auto">{formatCommentTime(c.created_at)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          className="flex-1 border rounded px-2 py-1 text-sm"
                          placeholder="Tulis komentar..."
                          value={commentInput}
                          onChange={e => setCommentInput(e.target.value)}
                          disabled={commentLoading}
                        />
                        <button
                          className="bg-[#2563eb] text-white px-4 py-1 rounded font-semibold text-sm"
                          onClick={() => handlePostComment(item.id)}
                          disabled={commentLoading || !commentInput.trim()}
                        >
                          {commentLoading ? "Mengirim..." : "Kirim"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
