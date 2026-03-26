"use client";

import Image from "next/image";
import Link from "next/link";
import { useHeaderVisibility } from "./useHeaderVisibility";

export function LandingHeader() {
  const isVisible = useHeaderVisibility();
  const userUrl = process.env.NEXT_PUBLIC_USER_URL?.trim() || "/login";

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
            href={userUrl}
            className="rounded-lg bg-[#F45F5F] px-6 py-2.5 font-medium text-[15px] text-white transition-opacity hover:opacity-80"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
