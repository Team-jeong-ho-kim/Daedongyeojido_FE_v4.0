import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  updateAnnouncement,
} from "@/api/announcement";
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

export const useUpdateAnnouncementMutation = (announcementId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AnnouncementCreate) =>
      updateAnnouncement(announcementId, data),
    onSuccess: () => {
      toast.success("공고가 수정되었습니다");
      setTimeout(() => {
        router.push(`/announcements/${announcementId}`);
      }, 1500);
    },
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 400) {
        toast.error("요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error("공고 수정 권한이 없습니다.");
      } else if (status === 404) {
        toast.error("존재하지 않는 공고입니다.");
      } else {
        toast.error("공고 수정에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};

export const useDeleteAnnouncementMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (announcementId: string) => deleteAnnouncement(announcementId),
    onSuccess: () => {
      toast.success("공고가 삭제되었습니다");
      setTimeout(() => {
        router.push("/announcements");
      }, 1500);
    },
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 403) {
        toast.error("공고 삭제 권한이 없습니다.");
      } else if (status === 404) {
        toast.error("존재하지 않는 공고입니다.");
      } else {
        toast.error("공고 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};

export const usePublishAnnouncementMutation = (announcementId: string) => {
  return useMutation({
    mutationFn: (applicationFormId: number) =>
      publishAnnouncement(announcementId, applicationFormId),
    onSuccess: () => {
      toast.success("공고가 게시되었습니다");
    },
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 400) {
        toast.error("요청 형식이 잘못되었습니다.");
      } else if (status === 403) {
        toast.error("공고 게시 권한이 없습니다.");
      } else if (status === 404) {
        toast.error("존재하지 않는 공고 또는 지원서 폼입니다.");
      } else {
        toast.error("공고 게시에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });
};
