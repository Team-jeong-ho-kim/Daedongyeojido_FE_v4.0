"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { Footer } from "ui";
import StudentHeaderWrapper from "@/components/layout/StudentHeaderWrapper";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login");

  return (
    <html lang="ko">
      <head>
        <title>대동여지도 - 나의 동아리를 찾는 지름길</title>
        <link rel="icon" href="/daedong.svg" type="image/svg+xml" />
      </head>
      <body>
        <QueryProvider>
          <UserProvider>
            <Toaster position="top-right" duration={3000} richColors />
            {!isAuthPage && <StudentHeaderWrapper />}
            <main className={isAuthPage ? "" : "pt-14"}>{children}</main>
            {!isAuthPage && <Footer />}
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
