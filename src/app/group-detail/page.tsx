// app/group-detail/page.tsx

import Footer from "@/components/common/Footer";
import GroupDetailLayout from "@/components/group-detail/GroupDetailLayout";
import { getGroupDetail } from "@/services/groupservices";
import { cookies } from "next/headers";

export default async function GroupDetailPage({ searchParams }: { searchParams: { id: string } }) {
  const { id: groupId } = searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const groupRes = (groupId && token) ? await getGroupDetail(groupId, token) : null;
  
  // PERBAIKAN: Data grup ada di dalam properti 'detail', bukan 'study_group'.
  const groupData = groupRes?.detail || null;

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Sekarang 'groupData' berisi objek { group, members, leaderboard } */}
      <GroupDetailLayout groupDetail={groupData} token={token} />
      <Footer />
    </div>
  );
}