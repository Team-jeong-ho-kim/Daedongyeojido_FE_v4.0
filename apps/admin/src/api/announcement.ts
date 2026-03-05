import { apiClient } from "utils";
import type {
  AdminAnnouncementListItem,
  AdminAnnouncementListResponse,
  AdminClubAnnouncement,
  AdminClubAnnouncementResponse,
} from "@/types/admin";

export const getAllAnnouncements = async (): Promise<
  AdminAnnouncementListItem[]
> => {
  const response =
    await apiClient.get<AdminAnnouncementListResponse>("/announcements");
  return response.data.announcements;
};

export const getClubAnnouncements = async (
  clubId: string,
): Promise<AdminClubAnnouncement[]> => {
  const response = await apiClient.get<AdminClubAnnouncementResponse>(
    `/announcements/clubs/${clubId}`,
  );
  return response.data.clubAnnouncements || [];
};
