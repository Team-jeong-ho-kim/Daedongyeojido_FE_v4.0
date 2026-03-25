import type { Metadata } from "next";
import { Toaster } from "sonner";
import { CloudflareAnalytics } from "ui";
import { AdminFooter, AdminLayoutContent } from "@/components/layout";
import { AdminProviders } from "@/components/providers";
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
  const analyticsToken =
    process.env.NEXT_PUBLIC_CLOUDFLARE_ADMIN_ANALYTICS_TOKEN;

  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/daedong.svg" type="image/svg+xml" />
        <CloudflareAnalytics token={analyticsToken} />
      </head>
      <body>
        <AdminProviders>
          <Toaster position="top-right" duration={3000} richColors />
          <AdminLayoutContent>{children}</AdminLayoutContent>
          <AdminFooter />
        </AdminProviders>
      </body>
    </html>
  );
}
