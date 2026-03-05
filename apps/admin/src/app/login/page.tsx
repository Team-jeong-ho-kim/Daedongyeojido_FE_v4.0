"use client";

import Image from "next/image";
import { useId } from "react";
import { useAdminLogin } from "@/hooks/useAdminLogin";

export default function AdminLoginPage() {
  const accountIdInput = useId();
  const passwordInput = useId();
  const {
    accountId,
    errorMessage,
    handleSubmit,
    password,
    pending,
    setAccountId,
    setPassword,
  } = useAdminLogin();

  return (
    <div className="flex min-h-screen bg-black">
      <div className="hidden flex-1 items-center justify-center p-8 lg:flex lg:p-16">
        <div className="w-full max-w-xl rounded-3xl bg-[#151515] p-10">
          <div className="mb-6 flex items-center gap-3">
            <Image src="/daedong.svg" alt="대동여지도" width={36} height={36} />
            <p className="font-semibold text-white text-xl">대동여지도 Admin</p>
          </div>
          <h1 className="font-bold text-3xl text-white leading-tight">
            관리자 로그인
          </h1>
          <p className="mt-3 text-base text-gray-400 leading-relaxed">
            권한 계정으로 로그인 후
            <br />
            동아리 운영 기능을 이용하세요.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-[#1a1a1a] px-6 py-12 sm:px-12 lg:my-6 lg:mr-6 lg:w-[540px]">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-2">
            <Image src="/daedong.svg" alt="로고" width={24} height={24} />
            <span className="font-semibold text-sm text-white">
              대동여지도 관리자
            </span>
          </div>

          <h2 className="mb-2 font-bold text-3xl text-white">로그인</h2>
          <p className="mb-8 text-gray-400">
            관리자 권한 계정으로 로그인하여
            <br />
            운영 기능에 접근하세요.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block text-gray-400 text-sm"
                htmlFor={accountIdInput}
              >
                DSM 계정 ID
              </label>
              <input
                id={accountIdInput}
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                className="w-full rounded-lg border border-transparent bg-[#2a2a2a] px-4 py-3.5 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                placeholder="계정 ID를 입력해주세요."
                autoComplete="username"
              />
            </div>

            <div>
              <label
                className="mb-2 block text-gray-400 text-sm"
                htmlFor={passwordInput}
              >
                비밀번호
              </label>
              <input
                id={passwordInput}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-transparent bg-[#2a2a2a] px-4 py-3.5 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                placeholder="비밀번호를 입력해주세요."
                type="password"
                autoComplete="current-password"
              />
            </div>

            {errorMessage && (
              <p className="rounded-lg border border-red-300/50 bg-red-500/10 px-3 py-2 text-red-300 text-sm">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="h-11 w-full rounded-lg bg-[#F45F5F] font-bold text-white transition hover:bg-[#e44c4c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
