"use client";
import { useEffect, useState, useRef } from "react";
import { FaRegClock } from "react-icons/fa";

export default function CountdownTimer({ seconds, onTimeUp, quizId }: { seconds: number; onTimeUp: () => void; quizId: string }) {
  const storageKey = `quiz-timer-${quizId}`;
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return seconds;
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      if (typeof window !== "undefined") localStorage.removeItem(storageKey);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (typeof window !== "undefined") localStorage.setItem(storageKey, String(next));
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft, onTimeUp, storageKey]);

  // Reset timer jika quizId berubah
  useEffect(() => {
    setTimeLeft(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(storageKey);
        if (saved && !isNaN(Number(saved))) return Number(saved);
      }
      return seconds;
    });
  }, [quizId, seconds, storageKey]);

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const percent = Math.max(0, Math.floor((timeLeft / seconds) * 100));

  if (timeLeft <= 0) {
    return (
      <div className="flex flex-col items-center justify-center p-2">
        <div className="flex items-center gap-2 text-red-500 text-2xl font-bold">
          <FaRegClock className="animate-pulse" />
          Waktu Habis!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full">
      <div className="flex items-center gap-2 mb-1">
        <FaRegClock className="text-red-400 animate-pulse" />
        <span className="text-lg font-semibold text-gray-800">Sisa Waktu</span>
      </div>
      <div className="text-4xl font-mono text-[#2563eb] tracking-widest mb-2">
        {minutes.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
      </div>
      <div className="w-full max-w-xs h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
