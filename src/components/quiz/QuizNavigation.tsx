import { FaChevronLeft, FaRegBookmark } from "react-icons/fa";

interface QuizNavigationProps {
  current: number;
  total: number;
  marked: boolean;
  setMarked: (v: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function QuizNavigation({
  current,
  total,
  marked,
  setMarked,
  onPrev,
  onNext,
}: QuizNavigationProps) {
  const prevDisabled = current === 0;
  const nextDisabled = current === total - 1;
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-2xl mx-auto mt-8">
      <button
        className={`flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold text-base w-full md:w-auto transition
          ${prevDisabled ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-[#2563eb] border-[#2563eb] hover:bg-blue-50"}`}
        disabled={prevDisabled}
        onClick={onPrev}
      >
        <FaChevronLeft />
        Sebelumnya
      </button>
      <div className="flex gap-3 w-full md:w-auto">
        <button
          type="button"
          className={`flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold text-base transition w-full md:w-auto ${
            marked
              ? "border-yellow-400 bg-yellow-200 text-yellow-800 hover:bg-yellow-300 hover:border-yellow-500"
              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-[#2563eb]/60"
          }`}
          onClick={() => setMarked(!marked)}
        >
          <FaRegBookmark />
          {marked ? "Batal Tandai" : "Tandai"}
        </button>
        <button
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-base shadow transition w-full md:w-auto
            ${nextDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#2563eb] text-white hover:bg-[#1e40af]"}`}
          onClick={onNext}
          disabled={nextDisabled}
        >
          Selanjutnya
          <FaChevronLeft className="rotate-180" />
        </button>
      </div>
    </div>
  );
}