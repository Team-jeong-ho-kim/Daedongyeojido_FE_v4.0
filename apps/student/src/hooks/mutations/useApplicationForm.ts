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

export const useSubmitApplicationMutation = (applicationFormId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitApplicationRequest) =>
      submitApplication(applicationFormId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
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
        queryKey: ["mySubmission", submissionId],
      });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
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
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      queryClient.invalidateQueries({ queryKey: ["mySubmissionHistory"] });
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
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
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
