import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LoginResponse } from "utils";
import { clearTokens } from "utils";
import { login, logout } from "@/api/auth";
import { getMyInfo } from "@/api/user";
import { getErrorMessage } from "@/lib/error";
import { isOnboardingRequired } from "@/lib/onboarding";

const normalizeUrl = (value: string) => value.trim().replace(/\/+$/, "");

const moveToWebLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  const envWebUrl = process.env.NEXT_PUBLIC_WEB_URL?.trim();

  if (!envWebUrl) {
    return;
  }

  const webUrl = normalizeUrl(envWebUrl);

  try {
    new URL(webUrl);
  } catch {
    return;
  }

  window.location.href = `${webUrl}/login`;
};

export const useLoginMutation = () => {
  return useMutation<
    LoginResponse,
    Error,
    { accountId: string; password: string }
  >({
    mutationFn: ({ accountId, password }) =>
      login({ accountId, password, division: "STUDENT" }),
    onSuccess: async (data) => {
      toast.success(`${data.userName}님, 환영합니다!`, { id: "login-success" });

      try {
        const userInfo = await getMyInfo();
        const needsOnboarding = isOnboardingRequired(userInfo);

        setTimeout(() => {
          window.location.href = needsOnboarding ? "/onboarding" : "/";
        }, 1200);
      } catch {
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "로그인에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage, { id: "login-error" });
    },
  });
};

export const useLogoutMutation = (onLogoutSuccess?: () => void) => {
  return useMutation<void, Error>({
    mutationFn: logout,
    onSuccess: () => {
      clearTokens();
      onLogoutSuccess?.();
      toast.success("로그아웃되었습니다.");
      setTimeout(() => {
        moveToWebLogin();
      }, 800);
    },
    onError: () => {
      clearTokens();
      onLogoutSuccess?.();
      moveToWebLogin();
    },
  });
};
