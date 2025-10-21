import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
