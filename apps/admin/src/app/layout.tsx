import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "대동여지도 관리자",
    template: "%s | 대동여지도 관리자",
  },
  description: "대동여지도 관리자 포털 - 동아리 및 사용자 관리",
  robots: {
    index: false,
    follow: false,
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
