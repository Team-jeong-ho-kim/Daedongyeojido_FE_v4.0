"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { toast } from "ui";
import { Carousel } from "@/components";
import { useLoginMutation } from "@/hooks/mutations/useAuth";

const carouselImages = [
  "/images/login/school.svg",
  "/images/login/school.svg",
  "/images/login/school.svg",
];

export default function LoginPage() {
  const [account_id, setAccount_id] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate: login, isPending: loginPending } = useLoginMutation();

  const handleLogin = () => {
    if (!accountId.trim()) {
      toast.error("DSM 계정 ID를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    login({ account_id, password });
  };

  const accountId = useId();
  const passwordId = useId();
  const rememberId = useId();

  return (
    <div className="flex min-h-screen bg-black">
      {/* 캐러셀: 모바일에서는 숨김 */}
      <div className="hidden flex-1 items-center justify-center p-8 lg:flex lg:p-16">
        <div className="w-full max-w-2xl">
          <Carousel images={carouselImages} />
        </div>
      </div>

      {/* 우측 로그인폼 */}
      <div className="flex w-full flex-col items-center justify-between rounded-3xl bg-[#1a1a1a] px-6 py-12 sm:px-12 sm:py-16 lg:my-6 lg:mr-6 lg:w-[540px]">
        <div className="flex w-full max-w-md flex-col items-center">
          <div className="mb-12">
            <Image
              src="/images/login/blackLogo.svg"
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
                  htmlFor={accountId}
                  className="mb-2 block text-gray-400 text-sm"
                >
                  DSM 계정 ID
                </label>
                <input
                  value={account_id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAccount_id(e.target.value)
                  }
                  id={accountId}
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
                <input
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  id={passwordId}
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  className="w-full rounded-lg border border-transparent bg-[#2a2a2a] px-4 py-3.5 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
                />
              </div>

              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={rememberId}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-600 bg-transparent checked:border-gray-500 checked:bg-gray-600"
                />
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 h-4 w-4 text-gray-300 opacity-0 peer-checked:opacity-100"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                </svg>
                <label
                  htmlFor={rememberId}
                  className="ml-2 cursor-pointer text-gray-400 text-sm"
                >
                  로그인 유지
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loginPending}
          type="button"
          className="w-full max-w-md rounded-lg bg-[#F45F5F] py-3.5 font-bold text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loginPending ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}
