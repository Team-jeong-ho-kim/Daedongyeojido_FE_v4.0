import { apiClient } from "utils";
import type { ClubDetailResponse, ClubsResponse, ClubUpdate } from "@/types";

export const getAllClubs = async () => {
  const response = await apiClient.get<ClubsResponse>("/clubs");
  return response.data.clubs;
};

export const getDetailClub = async (clubId: string) => {
  const response = await apiClient.get<ClubDetailResponse>(`/clubs/${clubId}`);
  return response.data;
};

export const updateClub = async (clubId: string, data: ClubUpdate) => {
  const response = await apiClient.patch(`/clubs/${clubId}`, data);
  return response.data;
};

export const dissolveClub = async () => {
  const response = await apiClient.post("/clubs/dissolution");
  return response.data;
};
