import { apiClient } from "utils";
import type {
  AnnouncementCreate,
  AnnouncementListResponse,
  ClubAnnouncementResponse,
} from "@/types/announcement";

export const getAllAnnouncements = async () => {
  const response =
    await apiClient.get<AnnouncementListResponse>("/announcements");
  return response.data.announcements;
};

export const getClubAnnouncements = async (clubId: string) => {
  const response = await apiClient.get<ClubAnnouncementResponse>(
    `/announcements/clubs/${clubId}`,
  );
  return response.data.clubAnnouncements || [];
};

export const createAnnouncement = async (data: AnnouncementCreate) => {
  const response = await apiClient.post("/announcements", data);
  return response.data;
};
