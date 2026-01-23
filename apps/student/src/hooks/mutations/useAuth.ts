import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LoginRequest, LoginResponse } from "utils";
import { login } from "@/api/auth";

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: ({ account_id, password }) => login({ account_id, password }),
    onSuccess: (data) => {
      toast.success(`${data.userName}님, 환영합니다!`);
      window.location.href = "/";
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
