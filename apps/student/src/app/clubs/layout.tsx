import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동아리 전체 조회",
  description:
    "다양한 동아리를 한눈에 확인하고 관심있는 동아리에 지원해보세요. 대동여지도에서 나에게 맞는 동아리를 찾아보세요.",
  openGraph: {
    title: "동아리 전체 조회 | 대동여지도",
    description:
      "다양한 동아리를 한눈에 확인하고 관심있는 동아리에 지원해보세요.",
  },
};

export default function ClubsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
