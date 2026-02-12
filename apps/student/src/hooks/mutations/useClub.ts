import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createClubApplication,
  deleteClubMember,
  dissolveClub,
  requestAddClubMember,
  updateClub,
} from "@/api/club";
import { getErrorMessage } from "@/lib/error";
import type { ClubUpdate } from "@/types";

export const useUpdateClubMutation = (clubId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      imageFile,
      imageChanged,
    }: {
      data: ClubUpdate;
      imageFile: File;
      imageChanged: boolean;
    }) => updateClub(clubId, data, imageFile, imageChanged),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      toast.success("변경 사항이 저장되었습니다.");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "동아리 수정에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};

export const useDissolveClubMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: dissolveClub,
    onSuccess: () => {
      toast.success("동아리 해체 신청이 완료되었습니다.");
      setTimeout(() => {
        router.push("/clubs");
      }, 1500);
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "동아리 해체 신청에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};

export const useCreateClubApplicationMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      clubName,
      oneLiner,
      introduction,
      major,
      link,
      clubImage,
    }: {
      clubName: string;
      oneLiner: string;
      introduction: string;
      major: string[];
      link: string[];
      clubImage: File;
    }) =>
      createClubApplication(
        clubName,
        oneLiner,
        introduction,
        major,
        link,
        clubImage,
      ),
    onSuccess: () => {
      toast.success(
        "개설 신청이 완료되었습니다. 관리자에서 수락 시 동아리가 개설됩니다",
      );
      setTimeout(() => {
        router.push("/mypage/notifications");
      }, 1500);
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "동아리 개설 신청에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};

export const useDeleteClubMemberMutation = (clubId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => deleteClubMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      toast.success("팀원이 삭제되었습니다.");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "팀원 삭제에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};

export const useRequestAddClubMemberMutation = (clubId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userName,
      classNumber,
    }: {
      userName: string;
      classNumber: string;
    }) => requestAddClubMember(userName, classNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      toast.success("팀원 추가 신청이 완료되었습니다");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "팀원 추가 신청에 실패했습니다. 다시 시도해주세요.",
      );
      toast.error(errorMessage);
    },
  });
};
