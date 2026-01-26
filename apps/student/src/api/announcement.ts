import { apiClient } from "utils";
import type {
  AnnouncementCreate,
  AnnouncementDetailResponse,
  AnnouncementListResponse,
  ClubAnnouncementResponse,
} from "@/types/announcement";

export const getAllAnnouncements = async () => {
  const response =
    await apiClient.get<AnnouncementListResponse>("/announcements");
  return response.data.announcements;
};

export const getDetailAnnouncement = async (announcementId: string) => {
  const response = await apiClient.get<AnnouncementDetailResponse>(
    `/announcements/${announcementId}`,
  );
  return response.data;
};

export const getClubAnnouncements = async (clubId: number) => {
  const response = await apiClient.get<ClubAnnouncementResponse>(
    `/announcements/clubs/${clubId}`,
  );
  return response.data.clubAnnouncements || [];
};

export const createAnnouncement = async (data: AnnouncementCreate) => {
  const response = await apiClient.post("/announcements", data);
  return response.data;
};
