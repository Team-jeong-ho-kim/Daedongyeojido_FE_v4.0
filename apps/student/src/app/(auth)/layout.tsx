import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "대동여지도에 로그인하여 동아리 지원, 공고 확인, 마이페이지 관리 등 다양한 서비스를 이용하세요. DSM 계정으로 간편하게 로그인할 수 있습니다.",
  keywords: ["로그인", "DSM 로그인", "대동여지도 로그인", "회원 로그인"],
  openGraph: {
    title: "로그인 | 대동여지도",
    description: "대동여지도에 로그인하여 동아리 서비스를 이용하세요.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
