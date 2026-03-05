"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "utils";
import { login } from "@/api/admin";
import {
  clearTokens,
  getAccessToken,
  saveAdminSessionUser,
  saveTokens,
} from "@/lib/token";

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.description;
  return fallback;
};

export const useAdminLogin = () => {
  const router = useRouter();
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!accountId.trim() || !password.trim()) {
      setErrorMessage("계정과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setPending(true);
    try {
      const tokenResponse = await login({
        accountId: accountId.trim(),
        password,
      });

      saveTokens(tokenResponse);
      if (tokenResponse.role !== "ADMIN") {
        clearTokens();
        setErrorMessage("ADMIN 권한 계정만 접근할 수 있습니다.");
        return;
      }
      saveAdminSessionUser(tokenResponse);

      router.replace("/");
    } catch (error) {
      clearTokens();
      setErrorMessage(
        toErrorMessage(error, "로그인에 실패했습니다. 다시 시도해주세요."),
      );
    } finally {
      setPending(false);
    }
  };

  return {
    accountId,
    errorMessage,
    handleSubmit,
    password,
    pending,
    setAccountId,
    setPassword,
  };
};
