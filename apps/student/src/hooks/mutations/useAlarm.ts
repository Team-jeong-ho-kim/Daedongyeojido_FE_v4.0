import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptMemberRequest,
  rejectMemberRequest,
  selectClubSubmission,
} from "@/api/alarm";

const ERROR_MESSAGES = {
  400: "요청 형식이 잘못되었습니다.",
  403: "권한이 없습니다.",
  404: "요청을 찾을 수 없습니다.",
} as const;

const handleMutationError = (error: any, fallbackMessage: string) => {
  const status = error.response?.status;
  const serverMessage =
    error.response?.data?.description || error.response?.data?.message;

  const errorMessage =
    serverMessage ||
    ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES] ||
    fallbackMessage;

  toast.error(errorMessage);
};

export const useAcceptMemberRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptMemberRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlarms"] });
      toast.success("수락되었습니다.");
    },
    onError: (error) =>
      handleMutationError(error, "수락에 실패했습니다. 다시 시도해주세요."),
  });
};

export const useRejectMemberRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectMemberRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlarms"] });
      toast.success("거절되었습니다.");
    },
    onError: (error) =>
      handleMutationError(error, "거절에 실패했습니다. 다시 시도해주세요."),
  });
};

export const useSelectClubSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      isSelected,
      alarmId,
    }: {
      isSelected: boolean;
      alarmId: number;
    }) => selectClubSubmission(isSelected, alarmId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userAlarms"] });
      toast.success(
        variables.isSelected ? "합류가 완료되었습니다." : "거절되었습니다.",
      );
    },
    onError: (error) =>
      handleMutationError(error, "처리에 실패했습니다. 다시 시도해주세요."),
  });
};
