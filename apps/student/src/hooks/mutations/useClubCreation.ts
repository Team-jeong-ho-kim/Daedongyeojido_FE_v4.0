import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createClubCreationApplication,
  submitClubCreationApplication,
  updateClubCreationApplication,
} from "@/api/clubCreation";
import { getErrorMessage } from "@/lib/error";
import { queryKeys } from "@/lib/queryKeys";

type ClubCreationMutationInput = {
  clubCreationForm: File;
  clubImage?: File | null;
  clubName: string;
  introduction: string;
  link?: string[];
  major: string[];
  oneLiner: string;
  teacherId: number;
};

type ClubCreationUpdateMutationInput = {
  applicationId: number;
  clubCreationForm?: File | null;
  clubImage?: File | null;
  clubName?: string;
  introduction?: string;
  link?: string[];
  major?: string[];
  oneLiner?: string;
};

export const useCreateClubCreationApplicationMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClubCreationMutationInput) =>
      createClubCreationApplication(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.clubCreationApplication.me.queryKey,
      });
      toast.success("개설 신청이 완료되었습니다.");
      router.replace("/mypage");
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "동아리 개설 신청에 실패했습니다."),
      );
    },
  });
};

export const useUpdateClubCreationApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClubCreationUpdateMutationInput) =>
      updateClubCreationApplication(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.clubCreationApplication.me.queryKey,
      });
      toast.success("개설 신청 수정사항을 저장했습니다.");
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "동아리 개설 신청 수정에 실패했습니다."),
      );
    },
  });
};

export const useSubmitClubCreationApplicationMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: number) =>
      submitClubCreationApplication(applicationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.clubCreationApplication.me.queryKey,
      });
      toast.success("개설 신청을 다시 제출했습니다.");
      router.replace("/mypage");
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "동아리 개설 신청 재제출에 실패했습니다."),
      );
    },
  });
};
