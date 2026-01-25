import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncements, getClubAnnouncements } from "@/api/announcement";

export const useGetAllAnnouncementsQuery = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: getAllAnnouncements,
  });
};

export const useGetClubAnnouncementsQuery = (clubId: string) => {
  return useQuery({
    queryKey: ["announcements", "club", clubId],
    queryFn: () => getClubAnnouncements(clubId),
  });
};
