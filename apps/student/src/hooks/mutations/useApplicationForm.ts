"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { decidePass, deleteApplicationForm } from "@/api/applicationForm";
import { getErrorMessage } from "@/lib/error";
import type { DecidePassRequest } from "@/types";

export const useDeleteApplicationFormMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplicationForm,
    onSuccess: () => {
      toast.success("지원서 폼이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["applicationForms"] });
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "지원서 폼 삭제에 실패했습니다.",
      );
      toast.error(errorMessage);
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
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "합격/탈락 처리에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};
