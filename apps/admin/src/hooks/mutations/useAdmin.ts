"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  decideClubApplication,
  decideDissolution,
  deleteClubCreationForm,
  deleteResultDuration,
  setResultDuration,
  uploadClubCreationForm,
} from "@/api/admin";
import { getErrorMessage, queryKeys } from "@/lib";

export const useSetResultDurationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resultDuration: string) =>
      setResultDuration({ resultDuration }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.overview.queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.resultDuration.queryKey,
        }),
      ]);
      toast.success("결과 발표 기간을 설정했습니다.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "발표 기간 설정에 실패했습니다."));
    },
  });
};

export const useDeleteResultDurationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resultDurationId: number) =>
      deleteResultDuration(resultDurationId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.overview.queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.resultDuration.queryKey,
        }),
      ]);
      toast.success("결과 발표 기간을 삭제했습니다.");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "발표 기간 삭제에 실패했습니다."));
    },
  });
};

export const useDecideClubApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, isOpen }: { clubId: string; isOpen: boolean }) =>
      decideClubApplication(clubId, isOpen),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.overview.queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.clubCreationApplications.queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.clubs.all.queryKey,
        }),
      ]);
      toast.success(
        variables.isOpen
          ? "동아리 개설을 수락했습니다."
          : "동아리 개설을 거절했습니다.",
      );
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "동아리 개설 처리에 실패했습니다."));
    },
  });
};

export const useUploadClubCreationFormMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileName, fileUrl }: { fileName: string; fileUrl: File }) =>
      uploadClubCreationForm({ fileName, fileUrl }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.overview.queryKey,
      });
      toast.success("동아리 개설 양식을 업로드했습니다.");
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "동아리 개설 양식 업로드에 실패했습니다."),
      );
    },
  });
};

export const useDeleteClubCreationFormMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubCreationFormId: number) =>
      deleteClubCreationForm(clubCreationFormId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.overview.queryKey,
      });
      toast.success("동아리 개설 양식을 삭제했습니다.");
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "동아리 개설 양식 삭제에 실패했습니다."),
      );
    },
  });
};

export const useDecideDissolutionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clubId,
      isDecision,
    }: {
      clubId: string;
      isDecision: boolean;
    }) => decideDissolution(clubId, isDecision),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.overview.queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.clubs.all.queryKey,
        }),
      ]);
      toast.success(
        variables.isDecision
          ? "동아리 해체를 수락했습니다."
          : "동아리 해체를 거절했습니다.",
      );
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "동아리 해체 처리에 실패했습니다."));
    },
  });
};
