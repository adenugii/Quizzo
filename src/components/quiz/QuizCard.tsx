import React from "react";

// Props untuk QuizCard
export interface QuizCardProps {
  title: string;
  subtitle: string;
  level: "Mudah" | "Sedang" | "Sulit";
  levelColor: "green" | "yellow" | "red";
  questions: number;
  time: number;
  status: "progress" | "done" | "not_started";
  question: string;
  options: string[];
  selected: number;
  setSelected: (idx: number) => void;
}

// Badge warna sesuai level
const levelBadge = {
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-500",
};

export default function QuizCard({
  title,
  subtitle,
  level,
  levelColor,
  questions,
  time,
  status,
  question,
  options,
  selected,
  setSelected,
}: QuizCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header: Judul & Badge */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${levelBadge[levelColor]}`}>
          {level}
        </span>
      </div>
      <span className="text-xs text-gray-400 mb-1">{subtitle}</span>
      {/* Info Soal & Waktu */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-1">
        <span>
          <span className="font-semibold">{questions} soal</span>
        </span>
        <span>
          <span className="font-semibold">{time} menit</span>
        </span>
      </div>
      {/* Progress Bar */}
      {/* <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress:</span>
          <span className="text-xs text-gray-500">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progress === 100
                ? "bg-green-500"
                : "bg-[#2563eb]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div> */}
      {/* Pertanyaan */}
      <div className="font-bold text-xl text-gray-900 mb-2 leading-relaxed">
        {question}
      </div>
      {/* Opsi Jawaban */}
      <div className="flex flex-col gap-4">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition
              ${
                selected === idx
                  ? "border-[#2563eb] bg-blue-50"
                  : "border-gray-200 bg-white hover:border-[#2563eb]/60"
              }
            `}
          >
            <input
              type="radio"
              name="answer"
              checked={selected === idx}
              onChange={() => setSelected(idx)}
              className="form-radio accent-[#2563eb] w-5 h-5"
            />
            <span className="font-semibold text-gray-700 text-base">
              {String.fromCharCode(65 + idx)}.
            </span>
            <span className="text-gray-700 text-base">{opt}</span>
          </label>
        ))}
      </div>
      {/* Tombol Aksi */}
      {status === "done" ? (
        <button
          className="w-full py-2 rounded-md bg-gray-100 text-gray-400 font-semibold text-base flex items-center justify-center gap-2 cursor-default"
          disabled
        >
          <svg width="18" height="18" fill="none" className="inline-block">
            <circle cx="9" cy="9" r="8" stroke="#22C55E" strokeWidth="2" />
            <path d="M6 9.5L8 11.5L12 7.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Selesai
        </button>
      ) : status === "progress" ? (
        <button className="w-full py-2 rounded-md bg-[#2563eb] text-white font-semibold text-base shadow hover:bg-[#1e40af] transition">
          
        </button>
      ) : (
        <button className="w-full py-2 rounded-md bg-[#2563eb] text-white font-semibold text-base shadow hover:bg-[#1e40af] transition">
          Mulai Quiz
        </button>
      )}
    </div>
  );
}