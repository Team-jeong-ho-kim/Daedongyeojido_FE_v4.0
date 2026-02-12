"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { useLoginMutation } from "@/hooks/mutations/useAuth";
import { getAccessToken } from "@/lib/token";

export default function LoginPage() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const { mutate: login, isPending: loginPending } = useLoginMutation();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const handleLogin = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // 이벤트 전파 차단
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 동기적으로 중복 요청 차단
    if (loginPending || isSubmittingRef.current) {
      return;
    }

    if (!accountId.trim()) {
      toast.error("DSM 계정 ID를 입력해주세요.", { id: "login-validation" });
      return;
    }

    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요.", { id: "login-validation" });
      return;
    }

    // 즉시 차단
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    login(
      { accountId, password },
      {
        onSettled: () => {
          isSubmittingRef.current = false;
          setIsSubmitting(false);
        },
      },
    );
  };

  const accountInputId = useId();
  const passwordId = useId();

  return (
    <div className="flex min-h-screen bg-black">
      {/* 왼쪽 이미지 섹션: 모바일에서는 숨김 */}
      <div className="hidden flex-1 items-center justify-center p-8 lg:flex lg:p-16">
        <div className="relative w-full max-w-2xl">
          <div className="mb-8 overflow-hidden rounded-3xl">
            <Image
              src="/images/login/school.svg"
              alt="학교 이미지"
              width={800}
              height={600}
              className="w-full object-cover"
            />
          </div>

          <div className="text-white">
            <h1 className="mb-4 font-bold text-3xl lg:text-4xl">
              나의 동아리를 찾는 지름길,
              <br />
              동아리에 가입해서 전공 실력을 길러보세요!
            </h1>
            <p className="text-gray-400 text-lg">
              자신의 전공 분야와 맞는 동아리를 찾고,
              <br />
              자신이 가입하고 싶은 동아리를 쉽게 관리 할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 우측 로그인폼 */}
      <div className="flex w-full flex-col items-center justify-between rounded-3xl bg-[#1a1a1a] px-6 py-12 sm:px-12 sm:py-16 lg:my-6 lg:mr-6 lg:w-[540px]">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-12">
            <Image
              src="/images/logos/blackLogo.svg"
              alt="대동여지도 로고"
              width={92}
              height={24}
            />
          </div>

          <div className="w-full">
            <h2 className="mb-3 font-bold text-3xl text-white">로그인</h2>
            <p className="mb-8 text-gray-400">
              대동여지도에서 다양한 동아리를 알아보고,
              <br />
              나의 동아리를 찾아보세요!
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor={accountInputId}
                  className="mb-2 block text-gray-400 text-sm"
                >
                  DSM 계정 ID
                </label>
                <input
                  value={accountId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAccountId(e.target.value)
                  }
                  id={accountInputId}
                  type="text"
                  placeholder="계정 ID를 입력해주세요."
                  className="w-full rounded-lg border border-transparent bg-[#2a2a2a] px-4 py-3.5 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor={passwordId}
                  className="mb-2 block text-gray-400 text-sm"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin();
                      }
                    }}
                    id={passwordId}
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력해주세요."
                    className="w-full rounded-lg border border-transparent bg-[#2a2a2a] px-4 py-3.5 pr-12 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="-translate-y-1/2 absolute top-1/2 right-4 text-white transition-colors hover:text-gray-100"
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                        stroke="currentColor"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1"
                        stroke="currentColor"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!loginPending && !isSubmitting && !isSubmittingRef.current) {
              handleLogin(e);
            }
          }}
          disabled={loginPending || isSubmitting}
          type="button"
          style={
            loginPending || isSubmitting ? { pointerEvents: "none" } : undefined
          }
          className="w-full max-w-md rounded-lg bg-[#F45F5F] py-3.5 font-bold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginPending || isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}
