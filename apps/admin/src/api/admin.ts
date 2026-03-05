import { apiClient, type LoginRequest, type LoginResponse } from "utils";
import type {
  AdminUserInfo,
  ApplicationFormListItem,
  ApplicationFormsResponse,
  ClubDetailResponse,
  ClubSummary,
  ClubsResponse,
} from "@/types/admin";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.delete("/auth/logout");
};

export const getMyInfo = async (): Promise<AdminUserInfo> => {
  const response = await apiClient.get<AdminUserInfo>("/users");
  return response.data;
};

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

export const getClubApplicationForms = async (
  clubId: string,
): Promise<ApplicationFormListItem[]> => {
  const response = await apiClient.get<ApplicationFormsResponse>(
    `/application-forms/clubs/${clubId}`,
  );
  return response.data.applicationForms;
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
