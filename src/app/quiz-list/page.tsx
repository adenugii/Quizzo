import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import QuizCard, { QuizCardProps } from "@/components/quiz/QuizCard";
import quizList from "@/data/quiz-data.json"; // Import data dari file JSON

export default function QuizResultPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Navbar */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Judul & Deskripsi */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Quiz Hasil dari Materimu
          </h1>
          <p className="text-gray-500 text-base">
            Uji pemahamanmu dengan mengerjakan quiz dari materi yang telah dipelajari
          </p>
        </div>

        {/* Filter & Urutkan */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium text-base">Filter:</span>
            <div className="relative">
              <select className="appearance-none border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm bg-white focus:outline-none focus:border-[#2563eb]">
                <option>Semua Quiz</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">&#9662;</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium text-base">Urutkan:</span>
            <div className="relative">
              <select className="appearance-none border border-gray-200 rounded-md px-4 py-2 pr-8 text-sm bg-white focus:outline-none focus:border-[#2563eb]">
                <option>Terbaru</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">&#9662;</span>
            </div>
          </div>
        </div>

        {/* Daftar Quiz */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {quizList.map((quiz, idx) => (
            <QuizCard
              key={quiz.title + idx}
              title={quiz.title}
              subtitle={quiz.subtitle}
              level={quiz.level as "Mudah" | "Sedang" | "Sulit"}
              levelColor={quiz.levelColor as "green" | "yellow" | "red"}
              questions={quiz.questions}
              time={quiz.time}
              status={quiz.status as "progress" | "done" | "not_started"}
              question={"-"}
              options={[]}
              selected={-1}
              setSelected={() => {}}
            />
          ))}
        </div>

        {/* Statistik Quiz */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[#2563eb] text-2xl font-bold mb-1">6</span>
            <span className="text-gray-500 text-sm">Total Quiz</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-green-600 text-2xl font-bold mb-1">1</span>
            <span className="text-gray-500 text-sm">Selesai</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-yellow-500 text-2xl font-bold mb-1">3</span>
            <span className="text-gray-500 text-sm">Dalam Progress</span>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-red-500 text-2xl font-bold mb-1">2</span>
            <span className="text-gray-500 text-sm">Belum Mulai</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}