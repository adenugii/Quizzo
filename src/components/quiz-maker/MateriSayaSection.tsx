import Link from "next/link";

interface MateriQuiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time_limit?: { String: string; Valid: boolean };
  created_by: string;
  questions: { id: string; quiz_id: string; question_text: string; options: { id: string; content: string }[] }[];
  created_at: string;
}

export default function MateriSayaSection({ quiz }: { quiz: MateriQuiz[] }) {
  function formatDate(dateStr: string) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  function getDifficultyColor(difficulty: string) {
    if (difficulty === "easy") return "bg-green-100 text-green-600 border-green-400";
    if (difficulty === "medium") return "bg-yellow-100 text-yellow-700 border-yellow-400";
    if (difficulty === "hard") return "bg-red-100 text-red-600 border-red-400";
    return "bg-gray-100 text-gray-600 border-gray-400";
  }
  function truncateTitle(title: string, max: number = 60) {
    return title.length > max ? title.slice(0, max) + "..." : title;
  }
  if (!quiz || quiz.length === 0) {
    return (
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Materi Saya</h2>
        </div>
        <div className="text-center py-12 text-[#2563eb] font-semibold text-lg">
          Kamu belum membuat quiz, ayo buat sekarang juga
        </div>
      </section>
    );
  }
  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Materi Saya</h2>
        <a
          href="#"
          className="text-sm text-[#2563eb] hover:underline font-medium"
        >
          lihat selengkapnya
        </a>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {quiz.map((item: MateriQuiz) => (
          <div key={item.id} className={`bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 border-t-4 ${getDifficultyColor(item.difficulty).split(' ')[2]}`}>
            <div className="flex items-center gap-2">
              <span className={`${getDifficultyColor(item.difficulty).split(' ').slice(0,2).join(' ')} text-xs font-semibold px-2 py-0.5 rounded`}>{item.difficulty}</span>
              <span className="text-xs text-gray-400 ml-auto">Uploaded {formatDate(item.created_at)}</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-base truncate" style={{maxWidth: '100%'}}>{truncateTitle(item.title)}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">{item.questions ? item.questions.length : 0} soal tersedia</span>
              <Link href={`/quiz-maker/${item.id}`}>
                <button className="bg-[#2563eb] text-white text-sm font-medium px-4 py-1.5 rounded shadow hover:bg-[#1e40af] transition">Mulai Quiz</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
