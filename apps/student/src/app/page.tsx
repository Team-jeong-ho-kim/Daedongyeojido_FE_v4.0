import type { Metadata } from "next";
import AboutSection from "@/components/main/AboutSection";
import ActionSection from "@/components/main/ActionSection";
import AnnouncementSection from "@/components/main/AnnouncementSection";
import ClubSection from "@/components/main/ClubSection";
import MainBanner from "@/components/main/MainBanner";

export const metadata: Metadata = {
  title: "대동여지도 - 나의 동아리를 찾는 지름길",
  description:
    "대덕소프트웨어마이스터고 전공동아리 정보를 한눈에 확인하고 온라인으로 지원하세요. 동아리 모집 공고, 지원서 작성, 면접 일정 관리까지 한 곳에서 간편하게.",
  keywords: [
    "대동여지도",
    "대마고 동아리",
    "전공동아리",
    "동아리 모집",
    "동아리 지원",
    "대덕소프트웨어마이스터고",
  ],
  openGraph: {
    title: "대동여지도 - 나의 동아리를 찾는 지름길",
    description:
      "대덕소프트웨어마이스터고 전공동아리 정보를 한눈에 확인하고 온라인으로 지원하세요.",
  },
};

export default function StudentPage() {
  return (
    <div className="-mt-14 mb-30 min-h-screen">
      <MainBanner />
      <AnnouncementSection />
      <ClubSection />
      <AboutSection />
      <ActionSection />
    </div>
  );
}
