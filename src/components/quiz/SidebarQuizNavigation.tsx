import CountdownTimer from "./CountdownTimer";

export default function SidebarQuizNavigation({
  questions,
  answers,
  marked,
  current,
  onGoto,
  quizId,
  timeLimitSeconds,
  onTimeUp
}: {
  questions: { id: string }[];
  answers: Record<string, string>;
  marked: boolean[];
  current: number;
  onGoto: (idx: number) => void;
  quizId: string;
  timeLimitSeconds: number;
  onTimeUp: () => void;
}) {
  return (
    <aside className="w-full md:w-64 mb-8 md:mb-0 md:mr-8 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
        <CountdownTimer seconds={timeLimitSeconds} onTimeUp={onTimeUp} quizId={quizId} />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="font-semibold mb-2 text-gray-900">Navigation Panel</div>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            let color = "bg-gray-200 text-gray-500 border-gray-300";
            if (marked[idx]) color = "bg-yellow-200 text-yellow-800 border-yellow-400";
            else if (answers[q.id] && answers[q.id] !== "") color = "bg-[#2563eb] text-white border-[#2563eb]";
            else if (current === idx) color = "bg-blue-900 text-white border-blue-900";
            return (
              <button
                key={q.id}
                className={`w-10 h-10 rounded font-bold border transition text-base ${color} ${current === idx ? "ring-2 ring-[#2563eb]" : ""}`}
                onClick={() => onGoto(idx)}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded bg-[#2563eb] inline-block"></span> Sudah dijawab</span>
          <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-200 inline-block"></span> Belum dijawab</span>
          <span className="inline-flex items-center gap-1"><span className="w-4 h-4 rounded bg-yellow-200 inline-block"></span> Ditandai</span>
        </div>
      </div>
    </aside>
  );
}
