import AuthGuard from "@/components/auth/AuthGuard";
import AboutSection from "@/components/main/AboutSection";
import ActionSection from "@/components/main/ActionSection";
import AnnouncementSection from "@/components/main/AnnouncementSection";
import ClubSection from "@/components/main/ClubSection";
import MainBanner from "@/components/main/MainBanner";

export default function StudentPage() {
  return (
    <AuthGuard>
      <div className="-mt-14 mb-30 min-h-screen">
        <MainBanner />
        <AnnouncementSection />
        <ClubSection />
        <AboutSection />
        <ActionSection />
      </div>
    </AuthGuard>
  );
}
