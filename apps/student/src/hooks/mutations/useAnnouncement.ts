import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAnnouncement } from "@/api/announcement";
import type { AnnouncementCreate } from "@/types/announcement";

export const useCreateAnnouncementMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AnnouncementCreate) => createAnnouncement(data),
    onSuccess: () => {
      toast.success("공고 등록이 완료되었습니다");
      setTimeout(() => {
        router.push("/announcements");
      }, 1500);
    },
    onError: (error: any) => {
      console.error("공고 생성 실패:", error);
      const status = error.response?.status;

      if (status === 400) {
        toast.error("요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error("공고 생성 권한이 없습니다.");
      } else {
        toast.error("공고 생성에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};
