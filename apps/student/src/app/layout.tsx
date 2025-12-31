import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Footer, Header } from "ui";
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
        <Toaster position="top-right" duration={3000} richColors />
        <Header />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
