import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동아리 공고",
  description:
    "대덕소프트웨어마이스터고 전공동아리 모집 공고를 확인하세요. 다양한 동아리의 모집 일정, 지원 자격, 활동 내용을 한눈에 살펴보고 관심있는 동아리에 지원하세요.",
  keywords: [
    "동아리 공고",
    "동아리 모집",
    "전공동아리 지원",
    "모집 공고",
    "동아리 지원",
  ],
  openGraph: {
    title: "동아리 공고 | 대동여지도",
    description:
      "대덕소프트웨어마이스터고 전공동아리 모집 공고를 확인하고 지원하세요.",
  },
};

export default function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
