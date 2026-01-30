"use client";

import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "shared";
import { useLogoutMutation } from "@/hooks/mutations/useAuth";

export default function MyPage() {
  const userInfo = useUserStore((state) => state.userInfo);
  const clearUser = useUserStore((state) => state.clearUser);
  const { mutate: logout } = useLogoutMutation(clearUser);

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">
          마이페이지
        </h1>

        <div className="mb-10 flex items-center gap-8">
          <Image
            src="/images/icons/profile.svg"
            alt="profile"
            className="h-18 w-18"
            width={15}
            height={15}
          />
          <div>
            <h2 className="mb-3 text-2xl tracking-tight">
              {userInfo?.userName}
            </h2>
            <div className="flex items-center gap-3 font-medium text-base text-gray-400">
              <span>{userInfo?.classNumber}</span>
              <span className="text-gray-400">|</span>
              <span>{userInfo?.clubName ?? "무소속"}</span>
              <span className="text-gray-400">|</span>
              <span className="rounded-full border border-primary-500 px-3 py-0.5 font-semibold text-primary-500 text-xs tracking-wide">
                {userInfo?.major?.join(", ") || "미정"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-12 h-px w-full bg-gray-200"></div>

        <div className="mb-16">
          <h3 className="mb-5 font-bold text-xl tracking-tight">내 소개</h3>
          <p className="mb-4 font-medium text-base text-gray-600 leading-relaxed">
            {userInfo?.introduction ?? "소개를 작성해주세요"}
          </p>
          {userInfo?.link && userInfo.link.length > 0 && (
            <div className="flex flex-col gap-2">
              {userInfo.link.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-fit items-center gap-4 text-gray-600 text-sm underline decoration-1 decoration-gray-600 underline-offset-4 transition-colors hover:text-gray-700 hover:decoration-gray-700"
                >
                  <Image
                    src="/images/icons/link.svg"
                    alt="link"
                    className="h-5 w-5"
                    width={20}
                    height={20}
                  />
                  {url}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mb-24">
          <h3 className="mb-6 font-bold text-xl tracking-tight">내 활동</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex h-[180px] flex-col justify-between rounded-2xl bg-gray-50 p-7 transition-colors hover:border-gray-200">
              <h4 className="font-bold text-gray-800 text-lg">
                알림함 바로가기
              </h4>
              <Link
                href="/mypage/notifications"
                className="w-fit rounded-xl bg-primary-500 px-5 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-[#F96464] hover:shadow-md active:scale-95"
              >
                알림함 조회
              </Link>
            </div>
            <div className="flex h-[180px] flex-col justify-between rounded-2xl bg-gray-50 p-7 transition-colors hover:border-gray-200">
              <h4 className="font-bold text-gray-800 text-lg">
                나의 지원서 바로가기
              </h4>
              <Link
                href="/mypage/applications"
                className="w-fit rounded-xl bg-primary-500 px-5 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-[#F96464] hover:shadow-md active:scale-95"
              >
                나의 지원서 보기
              </Link>
            </div>
            <div className="flex h-[180px] flex-col justify-between rounded-2xl bg-gray-50 p-7 transition-colors hover:border-gray-200">
              <h4 className="font-bold text-gray-800 text-lg">
                지원 이력 보기 바로가기
              </h4>
              <button
                type="button"
                className="w-fit rounded-xl bg-primary-500 px-5 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-[#F96464] hover:shadow-md active:scale-95"
              >
                지원 이력 조회
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/mypage/edit"
            className="rounded-xl bg-primary-500 px-8 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-[#F96464] hover:shadow-md active:scale-95"
          >
            수정하기
          </Link>
          <button
            type="button"
            className="rounded-xl bg-[#1F2937] px-8 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-95"
            onClick={() => logout()}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
