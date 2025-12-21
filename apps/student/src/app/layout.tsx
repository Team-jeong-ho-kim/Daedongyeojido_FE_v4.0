import type { Metadata } from "next";
import { Header } from "ui";
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
        <Header />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
