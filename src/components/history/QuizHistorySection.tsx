import { FaFlask, FaGlobe, FaBook, FaHourglass, FaLightbulb, FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";

const quizzes = [
  {
    idAttempt: "7989039f-118f-4b61-9a57-6e2421ab43d9",
    icon: <FaClipboardList size={28} className="text-[#3b82f6]" />,
    title: "Basic Mathematics Quiz",
    subtitle: "Matematika Dasar",
    date: "15 Nov 2024",
    score: 85,
    total: 100,
    status: "Lulus",
    statusColor: "bg-green-100 text-green-600",
    buttonColor: "bg-[#3b82f6]",
  },
  {
    idAttempt: "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
    icon: <FaFlask size={28} className="text-[#a78bfa]" />,
    title: "Chemistry Basics",
    subtitle: "Kimia",
    date: "12 Nov 2024",
    score: 92,
    total: 100,
    status: "Lulus",
    statusColor: "bg-green-100 text-green-600",
    buttonColor: "bg-[#a78bfa]",
  },
  {
    idAttempt: "123e4567-e89b-12d3-a456-426614174000",
    icon: <FaGlobe size={28} className="text-[#ef4444]" />,
    title: "World Geography",
    subtitle: "Geografi",
    date: "10 Nov 2024",
    score: 45,
    total: 100,
    status: "Gagal",
    statusColor: "bg-red-100 text-red-500",
    buttonColor: "bg-gray-700",
  },
  {
    idAttempt: "987f6543-21e0-1234-abcd-56789abcdef0",
    icon: <FaHourglass size={28} className="text-[#22c55e]" />,
    title: "Biology Fundamentals",
    subtitle: "Biologi",
    date: "8 Nov 2024",
    score: 78,
    total: 100,
    status: "Lulus",
    statusColor: "bg-green-100 text-green-600",
    buttonColor: "bg-[#22c55e]",
  },
  {
    idAttempt: "fedcba98-7654-3210-fedc-ba9876543210",
    icon: <FaLightbulb size={28} className="text-[#eab308]" />,
    title: "Physics Concepts",
    subtitle: "Fisika",
    date: "5 Nov 2024",
    score: 89,
    total: 100,
    status: "Lulus",
    statusColor: "bg-green-100 text-green-600",
    buttonColor: "bg-[#eab308]",
  },
  {
    idAttempt: "01234567-89ab-cdef-0123-456789abcdef",
    icon: <FaBook size={28} className="text-[#6366f1]" />,
    title: "English Literature",
    subtitle: "Bahasa Inggris",
    date: "3 Nov 2024",
    score: 94,
    total: 100,
    status: "Lulus",
    statusColor: "bg-green-100 text-green-600",
    buttonColor: "bg-[#6366f1]",
  },
];

export default function QuizHistorySection() {
  const router = useRouter();
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map((q, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-2 min-h-[180px] relative"
          >
            <div className="absolute right-5 top-5">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${q.statusColor}`}>{q.status}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              {q.icon}
              <div>
                <div className="font-semibold text-gray-800 text-base leading-tight">{q.title}</div>
                <div className="text-gray-500 text-sm">{q.subtitle}</div>
              </div>
            </div>
            <div className="text-gray-400 text-xs mb-1">{q.date}</div>
            <div className="font-bold text-lg mb-2" style={{ color: q.buttonColor.replace('bg-', '') }}>{q.score}/{q.total}</div>
            <button
              className={`w-full rounded-lg py-2 text-white font-semibold ${q.buttonColor} mt-auto`}
              onClick={() => router.push(`/quiz-result/${q.idAttempt}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
