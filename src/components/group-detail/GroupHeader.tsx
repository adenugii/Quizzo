 
import { FaStar, FaPlus, FaRegCopy } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getUserById } from "@/services/userservices";

interface GroupHeaderProps {
  group: {
    name: string;
    description: string;
    invite_code: string;
    member_count: number;
    max_member: number;
    created_by: string;
  };
  token?: string;
  onAddQuiz: () => void;
  tab: string;
  setTab: (tab: "quiz" | "anggota") => void;
}

export default function GroupHeader({ group, token, onAddQuiz, tab, setTab }: GroupHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [owner, setOwner] = useState<{ username?: string; image_url?: { String: string; Valid: boolean } } | null>(null);

  useEffect(() => {
    async function fetchOwner() {
      if (group.created_by) {
        const user = await getUserById(group.created_by, token);
        setOwner(user);
      }
    }
    fetchOwner();
  }, [group.created_by, token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="bg-violet-100 text-violet-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-sm">
            <FaStar />
          </div>
          <div>
            <div className="font-bold text-xl text-gray-900 leading-tight">
              {group?.name || "Study Squad"}
            </div>
            <div className="text-gray-500 text-sm mt-0.5">
              {group?.member_count ?? 0} / {group?.max_member ?? 0} anggota aktif
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {group?.description}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded">Invite Code: {group.invite_code}</span>
              <button onClick={handleCopy} className="text-violet-500 hover:text-violet-700 text-base" title="Copy invite code">
                <FaRegCopy />
              </button>
              {copied && <span className="text-green-500 text-xs ml-2">Copied!</span>}
            </div>
            {owner && (
              <div className="flex items-center gap-2 mt-2">
                <img src={owner.image_url?.Valid ? owner.image_url.String : "/profile.png"} alt={owner.username || "Owner"} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs text-gray-700">Owner: {owner.username || '-'}</span>
              </div>
            )}
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] transition text-white font-semibold px-5 py-2 rounded-lg text-base shadow"
          onClick={onAddQuiz}
        >
          <FaPlus />
          Tambah Quiz
        </button>
      </div>
      {/* Tab */}
      <div className="max-w-4xl mx-auto px-8 flex gap-10 mt-2">
        <button
          className={`py-3 font-semibold text-base transition border-b-2 ${
            tab === "quiz"
              ? "text-[#6366f1] border-[#6366f1]"
              : "text-gray-500 border-transparent hover:text-[#6366f1]"
          }`}
          onClick={() => setTab("quiz")}
        >
          Quiz Bersama
        </button>
        <button
          className={`py-3 font-semibold text-base transition border-b-2 ${
            tab === "anggota"
              ? "text-[#6366f1] border-[#6366f1]"
              : "text-gray-500 border-transparent hover:text-[#6366f1]"
          }`}
          onClick={() => setTab("anggota")}
        >
          Anggota
        </button>
      </div>
    </div>
  );
}