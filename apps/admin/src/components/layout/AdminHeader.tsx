"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full border-gray-200 border-b bg-white transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/whiteLogo.svg"
                alt="DD4D Logo"
                width={92}
                height={24}
                className="h-6"
              />
            </Link>

            <nav className="hidden items-center gap-10 md:flex">
              <Link
                href="/clubs"
                className={`text-[15px] transition-colors ${
                  pathname?.startsWith("/clubs")
                    ? "font-semibold text-gray-900"
                    : "font-normal text-gray-400 hover:text-gray-600"
                }`}
              >
                동아리
              </Link>
              <Link
                href="/announcements"
                className={`text-[15px] transition-colors ${
                  pathname?.startsWith("/announcements")
                    ? "font-semibold text-gray-900"
                    : "font-normal text-gray-400 hover:text-gray-600"
                }`}
              >
                공고
              </Link>
              <Link
                href="/documents"
                className={`text-[15px] transition-colors ${
                  pathname?.startsWith("/documents")
                    ? "font-semibold text-gray-900"
                    : "font-normal text-gray-400 hover:text-gray-600"
                }`}
              >
                양식
              </Link>
            </nav>
          </div>

          <div className="relative hidden items-center gap-3 md:flex">
            <Link
              href="/mypage"
              className="flex items-center gap-3 transition-opacity"
            >
              <span
                className={`font-normal text-[15px] transition-colors ${
                  pathname?.startsWith("/mypage")
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                마이페이지
              </span>
              <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/admin-profile-default.svg"
                  alt="프로필"
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="메뉴 열기"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="메뉴 닫기"
        />
      )}
      <div
        className={`fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-6">
          <Link
            href="/clubs"
            onClick={handleLinkClick}
            className={`border-gray-100 border-b py-4 text-[15px] transition-colors ${
              pathname?.startsWith("/clubs")
                ? "font-semibold text-gray-900"
                : "font-normal text-gray-600"
            }`}
          >
            동아리
          </Link>
          <Link
            href="/announcements"
            onClick={handleLinkClick}
            className={`border-gray-100 border-b py-4 text-[15px] transition-colors ${
              pathname?.startsWith("/announcements")
                ? "font-semibold text-gray-900"
                : "font-normal text-gray-600"
            }`}
          >
            공고
          </Link>
          <Link
            href="/documents"
            onClick={handleLinkClick}
            className={`border-gray-100 border-b py-4 text-[15px] transition-colors ${
              pathname?.startsWith("/documents")
                ? "font-semibold text-gray-900"
                : "font-normal text-gray-600"
            }`}
          >
            양식
          </Link>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/mypage"
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 transition-colors hover:bg-gray-200"
            >
              <span className="font-medium text-[15px] text-gray-400 hover:text-gray-600">
                마이페이지
              </span>
              <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/admin-profile-default.svg"
                  alt="프로필"
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
