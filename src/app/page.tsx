import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import ProfileCard from "@/components/profile/ProfileCard";
import HeroSection from "@/components/home/HeroSection";
import FiturUnggulanSection from "@/components/home/FiturUnggulanSection";
import CTASection from "@/components/home/CTASection";
import FeedSection from "@/components/home/FeedSection";
import SidebarSection from "@/components/home/SidebarSection";
import { cookies } from "next/headers";
import { getProfile } from "@/services/userservices";

export default async function Home() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value || "";
  let user = null;

  if (token) {
    user = await getProfile(token);
  }
  return (
    <div className="font-sans min-h-screen flex flex-col gap-0 bg-[#fafbfc]">
      <Navbar />
      {user ? (
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <ProfileCard user={user} />
            <FeedSection token={token} />
          </div>
          <SidebarSection token={token} />
        </div>
      ) : (
        <>
          <HeroSection />
          <FiturUnggulanSection />
          <CTASection />
        </>
      )}
      <Footer />
    </div>
  );
}

