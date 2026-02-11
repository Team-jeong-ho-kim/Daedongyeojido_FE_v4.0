import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptMemberRequest,
  rejectMemberRequest,
  selectClubSubmission,
} from "@/api/alarm";

export const useAcceptMemberRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alarmId: number) => acceptMemberRequest(alarmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlarms"] });
      toast.success("수락되었습니다.");
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error(message || "권한이 없습니다.");
      } else if (status === 404) {
        toast.error(message || "요청을 찾을 수 없습니다.");
      } else {
        toast.error("수락에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};

export const useRejectMemberRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alarmId: number) => rejectMemberRequest(alarmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAlarms"] });
      toast.success("거절되었습니다.");
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error(message || "권한이 없습니다.");
      } else if (status === 404) {
        toast.error(message || "요청을 찾을 수 없습니다.");
      } else {
        toast.error("거절에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};

// 동아리 합격 후 합류/거절 결정
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
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error(message || "권한이 없습니다.");
      } else if (status === 404) {
        toast.error(message || "지원서를 찾을 수 없습니다.");
      } else {
        toast.error(
          `처리에 실패했습니다. ${message ? `(${message})` : "다시 시도해주세요."}`,
        );
      }
    },
  });
};
