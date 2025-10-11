'use client';
// src/components/StudyGroup/StudyGroupCreateButton.tsx

import { useState } from "react";
import StudyGroupCreateCard from "./StudyGroupCreateCard";
import { createStudyGroup } from "@/services/groupservices";

export default function StudyGroupCreateButton({ token }: { token: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleCreateGroup = async (data: {
    name: string;
    description: string;
    max_member: number;
    is_private: boolean;
  }) => {
    setLoading(true);
    setError(undefined);
    try {
      // Panggil createStudyGroup dengan data DAN token
      // Error "Expected 1 arguments, but got 2" akan hilang
      await createStudyGroup(data, token);
      
      setShowCreate(false);
      window.location.reload(); // Refresh untuk melihat grup baru
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat grup.";
      setError(message);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          className="flex items-center gap-2 bg-[#2563eb] hover:bg-[#1e40af] transition text-white font-semibold px-5 py-2 rounded-lg text-base shadow"
          onClick={() => setShowCreate(true)}
        >
          <span className="text-xl leading-none">+</span>
          Buat Grup Belajar
        </button>
      </div>
      {showCreate && (
        <StudyGroupCreateCard
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateGroup}
          loading={loading}
          error={error}
        />
      )}
    </>
  );
}