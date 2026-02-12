import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptMemberRequest,
  rejectMemberRequest,
  selectClubSubmission,
} from "@/api/alarm";
import { getErrorMessage } from "@/lib/error";

export const useAcceptMemberRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptMemberRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlarms"] });
      toast.success("수락되었습니다.");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "수락에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
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
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "거절에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
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
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "처리에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};
