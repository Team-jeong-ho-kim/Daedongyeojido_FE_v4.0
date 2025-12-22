import type { Metadata } from "next";
import { Header } from "ui";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
