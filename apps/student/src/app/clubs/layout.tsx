import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동아리 전체 조회",
  description:
    "대덕소프트웨어마이스터고의 다양한 전공동아리를 한눈에 확인하고 관심있는 동아리에 지원해보세요. 각 동아리의 활동 내용, 멤버 구성, 프로젝트 정보를 확인할 수 있습니다.",
  keywords: [
    "동아리 목록",
    "전공동아리",
    "동아리 소개",
    "동아리 정보",
    "동아리 활동",
    "대마고 동아리",
  ],
  openGraph: {
    title: "동아리 전체 조회 | 대동여지도",
    description:
      "대덕소프트웨어마이스터고 전공동아리를 한눈에 확인하고 지원하세요.",
  },
};

export default function ClubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
