"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";
import type { LoginRequest, LoginResponse } from "utils";
import { ApiError, apiClient, saveSessionUser, saveTokens } from "utils";

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.description;
  return fallback;
};

const normalizeUrl = (value: string) => value.trim().replace(/\/$/, "");

const resolveServiceUrl = (
  envUrl: string | undefined,
  service: "web" | "student" | "admin",
) => {
  if (envUrl?.trim()) {
    return normalizeUrl(envUrl);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;

    if (hostname.endsWith(".daedongyeojido.site")) {
      const serviceHost =
        service === "web"
          ? "dsm.daedongyeojido.site"
          : `${service}.daedongyeojido.site`;

      return `${protocol}//${serviceHost}`;
    }
  }

  const localFallbackMap = {
    web: "http://localhost:3000",
    student: "http://localhost:3001",
    admin: "http://localhost:3002",
  } satisfies Record<typeof service, string>;

  return localFallbackMap[service];
};

export default function LoginPage() {
  const userUrl = resolveServiceUrl(
    process.env.NEXT_PUBLIC_USER_URL,
    "student",
  );
  const adminUrl = resolveServiceUrl(
    process.env.NEXT_PUBLIC_ADMIN_URL,
    "admin",
  );

  const accountIdInput = useId();
  const passwordInput = useId();
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!accountId.trim() || !password.trim()) {
      setErrorMessage("계정과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setPending(true);
    try {
      const payload: LoginRequest = {
        accountId: accountId.trim(),
        password,
      };

      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        payload,
      );
      saveTokens(response.data);
      saveSessionUser(response.data);

      if (response.data.role === "ADMIN") {
        window.location.href = adminUrl;
        return;
      }

      window.location.href = userUrl;
    } catch (error) {
      setErrorMessage(
        toErrorMessage(error, "로그인에 실패했습니다. 다시 시도해주세요."),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <div className="hidden flex-1 items-center justify-center p-8 lg:flex lg:p-16">
        <div className="w-full max-w-2xl">
          <Image
            src="/images/login/school.svg"
            alt="대동여지도 학교 이미지"
            width={960}
            height={720}
            className="h-auto w-full rounded-2xl object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-[#1a1a1a] px-6 py-12 sm:px-12 lg:my-6 lg:mr-6 lg:w-[540px]">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-2">
            <Image
              src="/images/logos/blackLogo.svg"
              alt="대동여지도 로고"
              width={92}
              height={24}
            />
          </div>

          <h2 className="mb-2 font-bold text-3xl text-white">로그인</h2>
          <p className="mb-8 text-gray-400">
            로그인 후 계정 권한(role)에 맞는 서비스로 이동합니다.
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
              <div className="relative">
                <input
                  id={passwordInput}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-transparent bg-[#2a2a2a] px-4 py-3.5 pr-12 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                  placeholder="비밀번호를 입력해주세요."
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="-translate-y-1/2 absolute top-1/2 right-4 text-gray-400 transition hover:text-gray-200"
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 표시"
                  }
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58A2 2 0 0012 16a2 2 0 001.42-.58M9.88 4.24A10.94 10.94 0 0112 4c5 0 9 4 10 8a11.63 11.63 0 01-4.14 5.94M6.1 6.1A11.64 11.64 0 002 12c1 4 5 8 10 8a10.93 10.93 0 004.62-1.02"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
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

          <Link
            href="/"
            className="mt-3 block w-full py-1 text-center font-medium text-gray-400 text-xs underline underline-offset-4 transition hover:text-gray-200"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
