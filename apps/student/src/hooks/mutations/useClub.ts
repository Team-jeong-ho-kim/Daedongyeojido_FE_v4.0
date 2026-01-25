import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { dissolveClub } from "@/api/club";

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
      console.error("동아리 해체 신청 실패:", error);
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
