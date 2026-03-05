"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError, clearTokens, getAccessToken, getSessionUser } from "utils";
import { logout } from "@/api/auth";

const moveToWebLogin = () => {
  const webUrl = (process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");
  window.location.href = `${webUrl}/login`;
};

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.description;
  return fallback;
};

export default function AdminMyPage() {
  const [booting, setBooting] = useState(true);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    userName: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        moveToWebLogin();
        if (!cancelled) setBooting(false);
        return;
      }

      const sessionUser = getSessionUser();
      if (!sessionUser || sessionUser.role !== "ADMIN") {
        clearTokens();
        moveToWebLogin();
        if (!cancelled) setBooting(false);
        return;
      }

      if (!cancelled) {
        setUserInfo({
          userName: sessionUser.userName,
          role: sessionUser.role,
        });
        setBooting(false);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    setLoadingLogout(true);

    try {
      await logout();
    } catch (error) {
      toast.error(
        toErrorMessage(error, "로그아웃 처리 중 오류가 발생했습니다."),
      );
    } finally {
      clearTokens();
      moveToWebLogin();
      setLoadingLogout(false);
    }
  };

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">
          마이페이지 정보를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">
          마이페이지
        </h1>

        <div className="mb-10 flex items-center gap-8">
          <Image
            src="/admin-profile-default.svg"
            alt="프로필 이미지"
            className="h-18 w-18 rounded-full object-cover"
            width={72}
            height={72}
          />
          <div>
            <h2 className="mb-3 text-2xl tracking-tight">
              {userInfo?.userName}
            </h2>
            <div className="flex items-center gap-3 font-medium text-base text-gray-400">
              <span>{userInfo?.role || "ADMIN"}</span>
            </div>
          </div>
        </div>

        <div className="mb-12 h-px w-full bg-gray-200" />

        <div className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex h-[180px] flex-col justify-between rounded-2xl bg-gray-50 p-7 transition-colors hover:border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg">
              동아리 관리 바로가기
            </h3>
            <Link
              href="/clubs"
              className="w-fit rounded-xl bg-primary-500 px-5 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-[#F96464] hover:shadow-md active:scale-95"
            >
              동아리 관리
            </Link>
          </div>

          <div className="flex h-[180px] flex-col justify-between rounded-2xl bg-gray-50 p-7 transition-colors hover:border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg">
              공고 페이지 바로가기
            </h3>
            <Link
              href="/announcements"
              className="w-fit rounded-xl bg-primary-500 px-5 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-[#F96464] hover:shadow-md active:scale-95"
            >
              공고 보기
            </Link>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-xl bg-[#1F2937] px-8 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleLogout}
            disabled={loadingLogout}
          >
            {loadingLogout ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      </div>
    </div>
  );
}
