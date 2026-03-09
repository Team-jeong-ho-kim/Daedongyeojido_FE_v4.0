"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncements, getAnnouncementDetail } from "@/api/announcement";
import { queryKeys } from "@/lib";

export const useGetAllAnnouncementsQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.announcements.all.queryKey,
    queryFn: getAllAnnouncements,
    enabled,
    select: (announcements) =>
      [...announcements].sort((a, b) => b.announcementId - a.announcementId),
  });
};

export const useGetAnnouncementDetailQuery = (
  announcementId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.announcements.detail(announcementId).queryKey,
    queryFn: () => getAnnouncementDetail(announcementId),
    enabled: enabled && !!announcementId,
  });
};
