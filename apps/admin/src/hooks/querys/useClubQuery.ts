"use client";

import { useQuery } from "@tanstack/react-query";
import { getClubAnnouncements } from "@/api/announcement";
import { getAllClubs, getClubDetail } from "@/api/club";
import { queryKeys } from "@/lib";

export const useGetAllClubsQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.clubs.all.queryKey,
    queryFn: getAllClubs,
    enabled,
  });
};

export const useGetClubDetailQuery = (clubId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.clubs.detail(clubId).queryKey,
    queryFn: () => getClubDetail(clubId),
    enabled: enabled && !!clubId,
  });
};

export const useGetClubAnnouncementsQuery = (
  clubId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.clubs.announcements(clubId).queryKey,
    queryFn: () => getClubAnnouncements(clubId),
    enabled: enabled && !!clubId,
    select: (announcements) =>
      [...announcements].sort((a, b) => b.announcementId - a.announcementId),
  });
};
