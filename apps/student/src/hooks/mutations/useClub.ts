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
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error(message || "수정 권한이 없습니다.");
      } else if (status === 404) {
        toast.error(message || "존재하지 않는 동아리입니다.");
      } else {
        toast.error("동아리 수정에 실패했습니다. 다시 시도해주세요.");
      }
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
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error(message || "해체 신청 권한이 없습니다.");
      } else if (status === 404) {
        toast.error(message || "동아리를 찾을 수 없습니다.");
      } else {
        toast.error("동아리 해체 신청에 실패했습니다. 다시 시도해주세요.");
      }
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
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error(message || "동아리 개설 권한이 없습니다.");
      } else if (status === 409) {
        toast.error(message || "중복된 요청입니다.");
      } else {
        toast.error("동아리 개설 신청에 실패했습니다. 다시 시도해주세요.");
      }
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
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 403) {
        toast.error(message || "팀원 삭제 권한이 없습니다.");
      } else if (status === 404) {
        toast.error(message || "존재하지 않는 팀원입니다.");
      } else {
        toast.error("팀원 삭제에 실패했습니다. 다시 시도해주세요.");
      }
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
    onError: (error: any) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.description || error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error(message || "팀원 추가 권한이 없습니다.");
      } else if (status === 404) {
        toast.error(message || "존재하지 않는 팀원입니다.");
      } else if (status === 409) {
        toast.error(message || "중복된 요청입니다.");
      } else {
        toast.error("팀원 추가 신청에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};
