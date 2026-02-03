"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteApplicationForm } from "@/api/applicationForm";

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
