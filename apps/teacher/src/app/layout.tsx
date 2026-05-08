import type { Metadata } from "next";
import { CloudflareAnalytics, Footer } from "ui";
import { ChannelTalkProvider } from "@/components/channelTalk/ChannelTalkProvider";
import { TeacherLayoutContent } from "@/components/layout";
import { QueryProvider } from "@/components/providers";
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
  const analyticsToken =
    process.env.NEXT_PUBLIC_CLOUDFLARE_TEACHER_ANALYTICS_TOKEN;

  return (
    <html lang="ko">
      <head>
        <CloudflareAnalytics token={analyticsToken} />
      </head>
      <body>
        <ChannelTalkProvider />
        <QueryProvider>
          <TeacherLayoutContent>{children}</TeacherLayoutContent>
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}
