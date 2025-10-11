/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import GroupHeader from "./GroupHeader";
import GroupQuizModal from "./GroupQuizModal";
import GroupProgress from "./GroupProgress";
import GroupQuizList from "./GroupQuizList";
import GroupTopPerformers from "./GroupTopPerformers";
import GroupMembers from "./GroupMembers";
import QuizResultModal from "./QuizResultModal";
import { useEffect, useState } from "react";
import { getGroupQuizzes } from "@/services/groupservices";
import { getMyQuiz } from "@/services/quizservices";

// Menerima prop 'groupDetail' yang strukturnya sesuai dengan respons API
export default function GroupDetailLayout({ groupDetail, token }: { groupDetail: any; token?: string }) {
  // 1. Ekstrak data dari prop dengan fallback untuk mencegah error jika data null
  const group = groupDetail?.group ?? {};
  const apiMembers = groupDetail?.members ?? [];
  const apiLeaderboard = groupDetail?.leaderboard ?? [];
  const quizzes = groupDetail?.quizzes ?? []; // Asumsi quizzes ada di sini

  // 2. Lakukan pemetaan data anggota (API -> Komponen)
  const mappedMembers = apiMembers.map((member: any) => {
    const leaderboardInfo = apiLeaderboard.find((p: any) => p.user_id === member.user_id);
    return {
      name: member.username,
      avatar: member.image_url.Valid 
        ? member.image_url.String 
        : `https://ui-avatars.com/api/?name=${member.username.replace(/\s/g, '+')}&background=random`,
      role: member.user_id === group.created_by ? "Leader" : "Anggota",
      xp: leaderboardInfo?.total_score ?? 0,
      quizDone: 0, // API tidak menyediakan data ini, jadi kita beri nilai default
    };
  });

  // 3. Lakukan pemetaan data top performers (leaderboard)
  const mappedTopPerformers = apiLeaderboard.map((performer: any, idx: number) => ({
    name: performer.username,
    avatar: performer.image_url.Valid 
      ? performer.image_url.String 
      : `https://ui-avatars.com/api/?name=${performer.username.replace(/\s/g, '+')}&background=random`,
    xp: performer.total_score,
    rank: idx + 1,
    quizDone: 0, // API tidak menyediakan data ini, jadi kita beri nilai default
  }));

  // Sisa state dan handler dari kode asli Anda
  const [tab, setTab] = useState<"quiz" | "anggota">("quiz");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: group?.name || "",
    desc: group?.description || "",
    maxMember: group?.max_member || "",
    picture: undefined as File | undefined,
    isPublic: !group?.is_private,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<any>(undefined);
  const [groupQuizzes, setGroupQuizzes] = useState<any[]>([]);
  const [myQuizzes, setMyQuizzes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGroupQuizzes() {
      if (group?.id && token) {
        try {
          const quizzes = await getGroupQuizzes(group.id, token);
          setGroupQuizzes(quizzes);
        } catch {}
      }
    }
    fetchGroupQuizzes();
  }, [group?.id, token]);

  useEffect(() => {
    async function fetchMyQuizzes() {
      if (showModal && token) {
        try {
          const quizzes = await getMyQuiz(token);
          setMyQuizzes(quizzes || []);
        } catch {}
      }
    }
    fetchMyQuizzes();
  }, [showModal, token]);

  // Kalkulasi progress menggunakan data yang sudah dipetakan
  const progress = {
    totalQuiz: groupQuizzes.length,
    activeMembers: group?.member_count ?? 0,
    maxMembers: group?.max_member ?? 0,
    totalXP: mappedTopPerformers.reduce((acc: number, p: { xp: number }) => acc + p.xp, 0),
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, picture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleTogglePublic = () => setForm((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  const handleShowResult = (result: any) => {
    setResultData(result);
    setShowResult(true);
  };
  const handleRefreshGroupQuizzes = async () => {
    if (group?.id && token) {
      try {
        const quizzes = await getGroupQuizzes(group.id, token);
        setGroupQuizzes(quizzes);
      } catch {}
    }
  };
  const fallbackResult = { /* ... */ };

  return (
    <div>
      {/* Teruskan data yang sudah diekstrak dan dipetakan ke komponen anak */}
      <GroupHeader
        group={group}
        token={token}
        onAddQuiz={() => setShowModal(true)}
        tab={tab}
        setTab={setTab}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <GroupQuizModal
          show={showModal}
          onClose={() => setShowModal(false)}
          quizzes={myQuizzes}
          loading={false}
          selectedQuizId={null}
          onSelectQuiz={() => {}}
          onSubmit={() => {}}
          groupId={group?.id}
          token={token}
          onRefresh={handleRefreshGroupQuizzes}
        />
        {tab === "quiz" && (
          <>
            <GroupProgress progress={progress} />
            <GroupQuizList quizzes={groupQuizzes} token={token} groupId={group?.id} />
            <GroupTopPerformers topPerformers={mappedTopPerformers} />
          </>
        )}
        {tab === "anggota" && (
          <GroupMembers members={mappedMembers} />
        )}
        <QuizResultModal
          show={showResult}
          onClose={() => setShowResult(false)}
          result={resultData ?? fallbackResult}
        />
      </main>
    </div>
  );
}