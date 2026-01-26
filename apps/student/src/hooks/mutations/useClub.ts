import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { dissolveClub, updateClub } from "@/api/club";
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

      if (status === 400) {
        toast.error("요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error("수정 권한이 없습니다.");
      } else if (status === 404) {
        toast.error("존재하지 않는 동아리입니다.");
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

      if (status === 400) {
        toast.error("요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error("해체 신청 권한이 없습니다.");
      } else if (status === 404) {
        toast.error("동아리를 찾을 수 없습니다.");
      } else {
        toast.error("동아리 해체 신청에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};
