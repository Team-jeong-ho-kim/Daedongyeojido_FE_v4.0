"use client";

import { useRouter } from "next/navigation";

export function ClubCreationAccessBlocked() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center shadow-sm">
        <h1 className="font-bold text-gray-900 text-xl">
          내 개설 신청을 조회할 수 없습니다
        </h1>
        <p className="mt-3 text-gray-600 text-sm leading-6">
          동아리원 및 동아리 리더는 현재 소속 동아리 활동 중인 상태이므로 개설
          신청 조회 및 수정 대상이 아닙니다.
        </p>
        <button
          type="button"
          onClick={() => router.push("/mypage")}
          className="mt-6 rounded-xl bg-primary-500 px-5 py-3 font-semibold text-sm text-white transition hover:bg-primary-600"
        >
          마이페이지로 이동
        </button>
      </div>
    </div>
  );
}
