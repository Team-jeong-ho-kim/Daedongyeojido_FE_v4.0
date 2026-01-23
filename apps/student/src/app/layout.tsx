import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Footer } from "ui";
import StudentHeaderWrapper from "@/components/layout/StudentHeaderWrapper";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { UserProvider } from "@/components/providers/UserProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Student portal application",
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
            <StudentHeaderWrapper />
            <main className="pt-14">{children}</main>
            <Footer />
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
