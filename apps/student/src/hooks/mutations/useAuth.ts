import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LoginRequest, LoginResponse } from "utils";
import { login, logout } from "@/api/auth";
import { getMyInfo } from "@/api/user";
import { getErrorMessage } from "@/lib/error";
import { clearTokens, saveTokens } from "@/lib/token";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: ({ accountId, password }) => login({ accountId, password }),
    onSuccess: async (data) => {
      saveTokens(data);

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
        window.location.href = "/login";
      }, 800);
    },
    onError: () => {
      clearTokens();
      onLogoutSuccess?.();
      window.location.href = "/login";
    },
  });
};
