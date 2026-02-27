"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  decidePass,
  deleteApplicationForm,
  deleteMySubmission,
  submitApplication,
  submitMySubmission,
  updateMySubmission,
} from "@/api/applicationForm";
import { getErrorMessage } from "@/lib/error";
import { queryKeys } from "@/lib/queryKeys";
import type {
  DecidePassRequest,
  SubmitApplicationRequest,
  UpdateMySubmissionRequest,
} from "@/types";

export const useDeleteApplicationFormMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplicationForm,
    onSuccess: () => {
      toast.success("지원서 폼이 삭제되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.applicationForms._def,
      });
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
        queryKey:
          queryKeys.applications.submissionDetail(submissionId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.submissions.queryKey,
      });
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

export const useSubmitApplicationMutation = (applicationFormId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitApplicationRequest) =>
      submitApplication(applicationFormId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.mine.queryKey,
      });
      toast.success("지원서가 제출되었습니다.");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "지원서 제출에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};

export const useUpdateMySubmissionMutation = (submissionId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateMySubmissionRequest) =>
      updateMySubmission(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.mySubmission(submissionId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.mine.queryKey,
      });
      toast.success("지원서가 수정되었습니다.");
      router.push(`/mypage/applications/${submissionId}`);
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "지원서 수정에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};

export const useSubmitMySubmissionMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (submissionId: string) => submitMySubmission(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.mine.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.history.queryKey,
      });
      toast.success("지원서가 제출되었습니다.");
      router.push("/mypage/history");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "지원서 제출에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};

export const useDeleteMySubmissionMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (submissionId: string) => deleteMySubmission(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.all.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.mine.queryKey,
      });
      toast.success("지원서가 삭제되었습니다.");
      router.push("/mypage/applications");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "지원서 삭제에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};
