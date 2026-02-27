import { useQuery } from "@tanstack/react-query";
import {
  getAllAnnouncements,
  getClubAnnouncements,
  getDetailAnnouncement,
} from "@/api/announcement";
import { queryKeys } from "@/lib/queryKeys";

export const useGetAllAnnouncementsQuery = () => {
  return useQuery({
    queryKey: queryKeys.announcements.all.queryKey,
    queryFn: getAllAnnouncements,
  });
};

export const useGetDetailAnnounceQuery = (announcementId: string) => {
  return useQuery({
    queryKey: queryKeys.announcements.detail(announcementId).queryKey,
    queryFn: () => getDetailAnnouncement(announcementId),
  });
};

export const useGetClubAnnouncementsQuery = (clubId: string) => {
  return useQuery({
    queryKey: queryKeys.announcements.byClub(clubId).queryKey,
    queryFn: () => getClubAnnouncements(Number(clubId)),
    enabled: !!clubId,
    refetchOnMount: true,
  });
};
