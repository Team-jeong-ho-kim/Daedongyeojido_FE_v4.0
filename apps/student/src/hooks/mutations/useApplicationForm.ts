"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { decidePass, deleteApplicationForm } from "@/api/applicationForm";
import type { DecidePassRequest } from "@/types";

export const useDeleteApplicationFormMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplicationForm,
    onSuccess: () => {
      toast.success("지원서 폼이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["applicationForms"] });
    },
    onError: (error: Error) => {
      toast.error(`지원서 폼 삭제에 실패했습니다: ${error.message}`);
    },
  });
};

export const useDecidePassMutation = (submissionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DecidePassRequest) => decidePass(submissionId, data),
    onSuccess: (_, variables) => {
      const message = variables.isPassed
        ? "지원자를 합격 처리했습니다."
        : "지원자를 탈락 처리했습니다.";
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["submissionDetail", submissionId],
      });
      queryClient.invalidateQueries({ queryKey: ["applicationSubmissions"] });
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 404 && message?.includes("발표시간")) {
        toast.error(
          "발표시간이 설정되지 않았습니다. 먼저 발표시간을 설정해주세요.",
        );
      } else if (status === 403) {
        toast.error("합격/탈락 처리 권한이 없습니다.");
      } else if (status === 404) {
        toast.error("존재하지 않는 지원서입니다.");
      } else {
        toast.error("합격/탈락 처리에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};
