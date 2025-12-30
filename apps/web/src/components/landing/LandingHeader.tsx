"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
            href="/login"
            className="font-normal text-[15px] text-gray-400 transition-colors hover:text-gray-600"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}
