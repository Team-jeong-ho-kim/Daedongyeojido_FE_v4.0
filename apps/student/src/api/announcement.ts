import { apiClient } from "utils";
import type { AnnouncementCreate } from "@/types/announcement";

export const createAnnouncement = async (data: AnnouncementCreate) => {
  const response = await apiClient.post("/announcements", data);
  return response.data;
};
