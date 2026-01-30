"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "shared";

export function LandingHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full border-transparent border-b bg-white/70 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/whiteLogo.svg"
            alt="DD4D Logo"
            width={92}
            height={24}
            className="h-6"
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`${process.env.NEXT_PUBLIC_USER_URL}`}
            className="rounded-lg bg-[#F45F5F] px-6 py-2.5 font-medium text-[15px] text-white transition-opacity hover:opacity-80"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}

export function StudentHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const userInfo = useUserStore((state) => state.userInfo);

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
                src="/images/logos/whiteLogo.svg"
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
            </nav>
          </div>

          <div className="relative hidden items-center gap-3 md:flex">
            {userInfo ? (
              <div className="relative flex items-center gap-3">
                <Link
                  href="/mypage"
                  className="flex items-center gap-3 transition-opacity"
                >
                  <span className="font-normal text-[15px] text-gray-400 hover:text-gray-600">
                    마이페이지
                  </span>
                  <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src={userInfo.profileImage || "/images/icons/profile.svg"}
                      alt="프로필"
                      width={28}
                      height={28}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="transition-opacity"
                  aria-label="드롭다운 메뉴 열기"
                >
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                      aria-label="드롭다운 닫기"
                    />
                    <div className="absolute top-full right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                      <Link
                        href="/mypage/history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-6 py-3 text-center text-gray-600 text-sm transition-colors hover:bg-gray-50"
                      >
                        지원 내역
                      </Link>
                      <Link
                        href="/mypage/applications"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-6 py-3 text-center text-gray-600 text-sm transition-colors hover:bg-gray-50"
                      >
                        나의 지원서
                      </Link>
                      <Link
                        href="/mypage/notifications"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-6 py-3 text-center text-gray-600 text-sm transition-colors hover:bg-gray-50"
                      >
                        알림함
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600"
              >
                로그인
              </Link>
            )}
          </div>

          {/* 모바일 */}
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
          <div className="mt-6 flex flex-col gap-3">
            {userInfo ? (
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
                    src={userInfo.profileImage || "/images/icons/profile.svg"}
                    alt="프로필"
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="rounded-lg bg-gray-100 py-3 text-center font-medium text-[15px] text-gray-700 transition-colors hover:bg-gray-200"
              >
                로그인
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
