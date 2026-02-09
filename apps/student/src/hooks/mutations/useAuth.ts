import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LoginRequest, LoginResponse } from "utils";
import { login, logout } from "@/api/auth";
import { clearTokens } from "@/lib/token";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: ({ accountId, password }) => login({ accountId, password }),
    onSuccess: (data) => {
      toast.success(`${data.userName}님, 환영합니다!`);

      // 온보딩 필요 여부 체크 (이름, 학번 제외하고 하나라도 입력되어 있으면 완료)
      const hasAnyInfo =
        data.introduction ||
        (data.major && data.major.length > 0) ||
        (data.link && data.link.length > 0) ||
        data.profileImage;
      const needsOnboarding = !hasAnyInfo;

      setTimeout(() => {
        window.location.href = needsOnboarding ? "/onboarding" : "/";
      }, 1200);
    },
    onError: (error: any) => {
      console.error("로그인 실패:", error);
      const status = error.response?.status;

      if (status === 400) {
        toast.error("요청 형식이 잘못되었습니다.");
      } else if (status === 401) {
        toast.error("계정 ID 또는 비밀번호가 올바르지 않습니다.");
      } else if (status === 404) {
        toast.error("존재하지 않는 계정입니다.");
      } else {
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      }
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
    onError: (error) => {
      console.error("로그아웃 실패:", error);
      clearTokens();
      onLogoutSuccess?.();
      window.location.href = "/login";
    },
  });
};
