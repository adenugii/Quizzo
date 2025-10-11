import { cookies } from "next/headers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import QuizMakerClientWrapper from "@/components/quiz-maker/QuizMakerClientWrapper";

// Halaman Upload Materi
export default async function UploadPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || "";

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Navbar */}
      <Navbar />

      {/* Konten utama */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Judul & Deskripsi */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Upload Materi Belajarmu
          </h1>
          <p className="text-gray-500 text-base">
            Upload file PDF, DOCX atau tulis catatan untuk membuat kuiz dengan AI
          </p>
        </div>

        {/* Grid utama: Form upload & Tips + Materi Saya (Client) */}
        <QuizMakerClientWrapper token={token} />
      </main>

      <Footer />
    </div>
  );
}