import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "대동여지도 - 나의 동아리를 찾는 지름길",
    template: "%s | 대동여지도",
  },
  description:
    "대마고 동아리를 쉽게 찾고 지원할 수 있는 플랫폼입니다. 다양한 동아리 정보를 확인하고 온라인으로 간편하게 지원하세요.",
  keywords: [
    "대동여지도",
    "동아리",
    "대마고",
    "동아리 지원",
    "동아리 활동",
    "학생 동아리",
  ],
  authors: [{ name: "대동여지도" }],
  openGraph: {
    title: "대동여지도 - 나의 동아리를 찾는 지름길",
    description:
      "대마고 동아리를 쉽게 찾고 지원할 수 있는 플랫폼입니다. 다양한 동아리 정보를 확인하고 온라인으로 간편하게 지원하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "대동여지도",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/daedong.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/daedong.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
