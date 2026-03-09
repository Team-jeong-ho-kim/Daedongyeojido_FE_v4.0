import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LoginRequest, LoginResponse } from "utils";
import { clearTokens } from "utils";
import { login, logout } from "@/api/auth";
import { getMyInfo } from "@/api/user";
import { getErrorMessage } from "@/lib/error";

const normalizeUrl = (value: string) => value.trim().replace(/\/$/, "");

const moveToWebLogin = () => {
  const envWebUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const webUrl = envWebUrl?.trim()
    ? normalizeUrl(envWebUrl)
    : typeof window !== "undefined" &&
        window.location.hostname.endsWith(".daedongyeojido.site")
      ? `${window.location.protocol}//dsm.daedongyeojido.site`
      : "http://localhost:3000";

  window.location.href = `${webUrl}/login`;
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: ({ accountId, password }) => login({ accountId, password }),
    onSuccess: async (data) => {
      toast.success(`${data.userName}님, 환영합니다!`, { id: "login-success" });

      try {
        const userInfo = await getMyInfo();

        const hasAnyInfo =
          userInfo.introduction ||
          (userInfo.major && userInfo.major.length > 0) ||
          (userInfo.link && userInfo.link.length > 0) ||
          userInfo.profileImage;
        const needsOnboarding = !hasAnyInfo;

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
