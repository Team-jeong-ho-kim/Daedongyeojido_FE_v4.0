import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "대동여지도",
  description: "대마고 동아리 여기서 지원하고 도움받자",
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
