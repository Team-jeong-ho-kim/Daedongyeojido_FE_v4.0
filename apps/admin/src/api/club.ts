import { apiClient } from "utils";
import type {
  ClubDetailResponse,
  ClubSummary,
  ClubsResponse,
} from "@/types/admin";

export const getAllClubs = async (): Promise<ClubSummary[]> => {
  const response = await apiClient.get<ClubsResponse>("/clubs");
  return response.data.clubs;
};

export const getClubDetail = async (
  clubId: string,
): Promise<ClubDetailResponse> => {
  const response = await apiClient.get<ClubDetailResponse>(`/clubs/${clubId}`);
  return response.data;
};

export const decidePass = async (
  submissionId: string,
  isPassed: boolean,
): Promise<void> => {
  await apiClient.patch(`/clubs/pass/${submissionId}`, { isPassed });
};

export const dissolveClub = async (): Promise<void> => {
  await apiClient.post("/clubs/dissolution");
};
