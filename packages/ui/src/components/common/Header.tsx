"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BLACK_LOGO_PAGES = ["/", "/inquiry"];

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isTransparent = BLACK_LOGO_PAGES.includes(pathname);
  const logoSrc = isTransparent
    ? "/images/logos/blackLogo.svg"
    : "/images/logos/whiteLogo.svg";

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

  // 모바일 메뉴 열릴 때 스크롤 방지
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
        className={`fixed top-0 left-0 z-50 w-full border-b transition-all duration-300 ${
          isTransparent
            ? "border-transparent bg-white/30 backdrop-blur-md"
            : "border-gray-200 bg-white"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo + Navigation */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <Image
                src={logoSrc}
                alt="DD4D Logo"
                width={92}
                height={24}
                className="h-6"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-10 md:flex">
              <Link
                href="/clubs"
                className={`text-[15px] transition-colors hover:text-gray-600 ${
                  pathname?.startsWith("/clubs")
                    ? "font-semibold text-gray-900"
                    : "font-normal text-gray-400"
                }`}
              >
                동아리
              </Link>
              <Link
                href="/announcements"
                className={`text-[15px] transition-colors hover:text-gray-600 ${
                  pathname?.startsWith("/announcements")
                    ? "font-semibold text-gray-900"
                    : "font-normal text-gray-400"
                }`}
              >
                공고
              </Link>
              <Link
                href="/about"
                className={`text-[15px] transition-colors hover:text-gray-600 ${
                  pathname?.startsWith("/about")
                    ? "font-semibold text-gray-900"
                    : "font-normal text-gray-400"
                }`}
              >
                소개
              </Link>
            </nav>
          </div>

          {/* Desktop Right side buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600"
            >
              로그인
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/signup"
              className="font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600"
            >
              회원가입
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
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

      {/* Mobile Menu Overlay */}
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
            href="/about"
            onClick={handleLinkClick}
            className={`border-gray-100 border-b py-4 text-[15px] transition-colors ${
              pathname?.startsWith("/about")
                ? "font-semibold text-gray-900"
                : "font-normal text-gray-600"
            }`}
          >
            소개
          </Link>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="rounded-lg bg-gray-100 py-3 text-center font-medium text-[15px] text-gray-700 transition-colors hover:bg-gray-200"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              onClick={handleLinkClick}
              className="rounded-lg bg-primary-500 py-3 text-center font-medium text-[15px] text-white transition-colors hover:bg-primary-600"
            >
              회원가입
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
