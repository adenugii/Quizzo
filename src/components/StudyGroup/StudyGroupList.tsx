"use client";
import StudyGroupCard, { StudyGroupCardProps } from "./StudyGroupCard";
import { useEffect, useState } from "react";
import { getGroupQuizzes } from "@/services/groupservices";

interface Props {
  groups: StudyGroupCardProps[];
  token?: string;
}

export default function StudyGroupList({ groups, token }: Props) {
  const [quizCounts, setQuizCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchQuizCounts() {
      if (!groups || groups.length === 0 || !token) return;
      const counts: Record<string, number> = {};
      await Promise.all(
        groups.map(async (group) => {
          try {
            const quizzes = await getGroupQuizzes(group.id, token);
            counts[group.id] = quizzes.length;
          } catch {
            counts[group.id] = 0;
          }
        })
      );
      setQuizCounts(counts);
    }
    fetchQuizCounts();
  }, [groups, token]);

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Anda belum masuk grup sama sekali, ayo join grup atau buat group.
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {groups.map((group, idx) => (
        <StudyGroupCard
          key={group.title + idx}
          {...group}
          token={token}
          quizTotal={quizCounts[group.id] ?? group.quizTotal}
        />
      ))}
    </div>
  );
}
