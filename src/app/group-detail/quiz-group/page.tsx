import { cookies } from "next/headers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import GroupQuizList from "@/components/group-detail/GroupQuizList";
import { getGroupQuizzes } from "@/services/groupservices";

export default async function QuizGroupPage({ searchParams }: { searchParams: { id: string } }) {
  const { id: groupId } = searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  const quizzes = groupId && token ? await getGroupQuizzes(groupId, token) : [];

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Semua Quiz Grup
          </h1>
          <p className="text-gray-500 text-base">
            Berikut adalah seluruh quiz yang ada di grup ini
          </p>
        </div>
        <GroupQuizList quizzes={quizzes} token={token} groupId={groupId} showAll={true} />
      </main>
      <Footer />
    </div>
  );
}
