"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { clearTokens } from "utils";
import { logout } from "@/api/auth";
import { getErrorMessage, moveToWebLogin } from "@/lib";
import { useAdminSessionStore } from "@/stores";

export const useLogoutMutation = () => {
  const clearSession = useAdminSessionStore((state) => state.clearSession);

  return useMutation({
    mutationFn: logout,
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "로그아웃 처리 중 오류가 발생했습니다."),
      );
    },
    onSettled: () => {
      clearTokens();
      clearSession();
      moveToWebLogin();
    },
  });
};
