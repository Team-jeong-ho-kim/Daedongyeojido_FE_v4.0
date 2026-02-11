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
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || error.response?.data?.description;

      // 네트워크 에러 (인터넷 연결 끊김, 서버 접속 불가 등)
      if (!error.response) {
        toast.error("네트워크 연결을 확인해주세요.");
        return;
      }

      // 서버 응답 메시지가 있으면 우선 사용
      if (serverMessage) {
        toast.error(serverMessage);
        return;
      }

      // HTTP 상태 코드별 에러 처리
      switch (status) {
        case 400:
          toast.error("입력 형식이 올바르지 않습니다.");
          break;
        case 401:
          toast.error("계정 ID 또는 비밀번호가 올바르지 않습니다.");
          break;
        case 403:
          toast.error("계정이 비활성화되었거나 접근 권한이 없습니다.");
          break;
        case 404:
          toast.error("존재하지 않는 계정입니다.");
          break;
        case 429:
          toast.error("로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
          break;
        case 500:
        case 502:
        case 503:
          toast.error("서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
          break;
        case 504:
          toast.error("서버 응답 시간이 초과되었습니다. 다시 시도해주세요.");
          break;
        default:
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
