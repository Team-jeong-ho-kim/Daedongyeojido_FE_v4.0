import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Footer } from "ui";
import LayoutContent from "@/components/layout/LayoutContent";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "대동여지도 - 나의 동아리를 찾는 지름길",
    template: "%s | 대동여지도",
  },
  description:
    "대동여지도는 학생들이 자신에게 맞는 동아리를 쉽게 찾고 지원할 수 있도록 돕는 플랫폼입니다.",
  keywords: ["동아리", "학생", "지원", "동아리 활동", "대동여지도"],
  authors: [{ name: "대동여지도" }],
  verification: {
    google: "hf7Wmpstr3d6XCpt2EfJVsv7Z_DPRu7TwU6OPpNOcDU",
  },
  openGraph: {
    title: "대동여지도 - 나의 동아리를 찾는 지름길",
    description:
      "대동여지도는 학생들이 자신에게 맞는 동아리를 쉽게 찾고 지원할 수 있도록 돕는 플랫폼입니다.",
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
      <body>
        <QueryProvider>
          <UserProvider>
            <Toaster position="top-right" duration={3000} richColors />
            <LayoutContent>
              <main>{children}</main>
            </LayoutContent>
            <Footer />
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
