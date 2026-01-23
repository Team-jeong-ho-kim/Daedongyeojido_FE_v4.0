import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "ui";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { UserProvider } from "@/components/providers/UserProvider";

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
      <body>
        <QueryProvider>
          <UserProvider>
            {children}
            <Toaster position="top-right" />
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
