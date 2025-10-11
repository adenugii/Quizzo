import { cookies } from "next/headers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import QuizSayaClientWrapper from "@/components/quiz-maker/QuizSayaClientWrapper";

export default async function QuizSayaPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || "";

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Semua Quiz Saya
          </h1>
          <p className="text-gray-500 text-base">
            Berikut adalah seluruh materi/quiz yang pernah kamu buat
          </p>
        </div>
        <QuizSayaClientWrapper token={token} />
      </main>
      <Footer />
    </div>
  );
}
