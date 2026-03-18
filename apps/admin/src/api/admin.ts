import { apiClient } from "utils";
import type {
  AdminClubCreationApplication,
  AdminClubCreationApplicationDetailResponse,
  AdminClubCreationApplicationsResponse,
  ResultDurationResponse,
  ReviewClubCreationApplicationRequest,
} from "@/types/admin";

type ResultDurationPayload = {
  resultDuration: string;
};

type ClubCreationFormUploadPayload = {
  fileUrl: File;
  fileName: string;
};

export const getResultDuration = async (): Promise<ResultDurationResponse> => {
  const response =
    await apiClient.get<ResultDurationResponse>("/result-duration");
  return response.data;
};

export const setResultDuration = async (
  payload: ResultDurationPayload,
): Promise<void> => {
  await apiClient.post("/admin/result-duration", payload);
};

export const deleteResultDuration = async (
  resultDurationId: number,
): Promise<void> => {
  await apiClient.delete(`/admin/result-duration/${resultDurationId}`);
};

export const decideDissolution = async (
  clubId: string,
  isDecision: boolean,
): Promise<void> => {
  await apiClient.delete(`/admin/dissolution/${clubId}`, {
    data: { isDecision },
  });
};

export const getClubCreationApplications = async (): Promise<
  AdminClubCreationApplication[]
> => {
  const response = await apiClient.get<AdminClubCreationApplicationsResponse>(
    "/club-creation-applications",
  );
  return response.data.applications;
};

export const getClubCreationApplicationDetail = async (
  applicationId: string,
): Promise<AdminClubCreationApplicationDetailResponse> => {
  const response =
    await apiClient.get<AdminClubCreationApplicationDetailResponse>(
      `/club-creation-applications/${applicationId}`,
    );
  return response.data;
};

export const reviewClubCreationApplication = async (
  applicationId: string,
  payload: ReviewClubCreationApplicationRequest,
): Promise<void> => {
  await apiClient.put(
    `/club-creation-applications/${applicationId}/review`,
    payload,
  );
};

export const uploadClubCreationForm = async (
  payload: ClubCreationFormUploadPayload,
): Promise<void> => {
  const formData = new FormData();
  formData.append("fileUrl", payload.fileUrl, payload.fileUrl.name);
  formData.append("fileName", payload.fileName);

  await apiClient.post("/files", formData);
};

export const deleteClubCreationForm = async (fileId: number): Promise<void> => {
  await apiClient.delete(`/files/${fileId}`);
};
