import { useQuery } from "@tanstack/react-query";
import {
  getAllAnnouncements,
  getClubAnnouncements,
  getDetailAnnouncement,
} from "@/api/announcement";

export const useGetAllAnnouncementsQuery = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: getAllAnnouncements,
  });
};

export const useGetDetailAnnounceQuery = (announcementId: string) => {
  return useQuery({
    queryKey: ["announcement", announcementId],
    queryFn: () => getDetailAnnouncement(announcementId),
  });
};

export const useGetClubAnnouncementsQuery = (clubId: string) => {
  return useQuery({
    queryKey: ["announcements", "club", clubId],
    queryFn: () => getClubAnnouncements(Number(clubId)),
    enabled: !!clubId,
  });
};
