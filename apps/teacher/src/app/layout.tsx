import type { Metadata } from "next";
import "./globals.css";

const siteUrl = (
  process.env.NEXT_PUBLIC_TEACHER_URL || "http://localhost:3003"
).trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "대동여지도 지도 교사 포털",
    template: "%s | 대동여지도 지도 교사 포털",
  },
  description: "대동여지도 지도 교사 포털",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
