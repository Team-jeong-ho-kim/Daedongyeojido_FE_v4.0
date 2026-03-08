import { apiClient } from "utils";
import type {
  AdminClubCreationForm,
  AdminClubCreationFormDownload,
  ResultDurationResponse,
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

export const decideClubApplication = async (
  clubId: string,
  isOpen: boolean,
): Promise<void> => {
  await apiClient.patch(`/admin/clubs/applications/${clubId}`, { isOpen });
};

export const decideDissolution = async (
  clubId: string,
  isApproved: boolean,
): Promise<void> => {
  await apiClient.delete(`/admin/dissolution/${clubId}`, {
    data: { isApproved },
  });
};

export const getClubCreationForm = async (
  clubId: string,
): Promise<AdminClubCreationForm> => {
  const response = await apiClient.get<AdminClubCreationForm>(
    `/admin/club-creation-form/${clubId}`,
  );
  return response.data;
};

export const downloadClubCreationApplicationForm = async (
  clubCreationFormId: string,
): Promise<AdminClubCreationFormDownload> => {
  const response = await apiClient.get<AdminClubCreationFormDownload>(
    `/club-creation-form/${clubCreationFormId}`,
  );
  return response.data;
};

export const uploadClubCreationForm = async (
  payload: ClubCreationFormUploadPayload,
): Promise<void> => {
  const formData = new FormData();
  formData.append("fileUrl", payload.fileUrl, payload.fileUrl.name);
  formData.append("fileName", payload.fileName);

  await apiClient.post("/admin/club-creation-form", formData);
};

export const deleteClubCreationForm = async (
  clubCreationFormId: string,
): Promise<void> => {
  await apiClient.delete(`/admin/club-creation-form/${clubCreationFormId}`);
};
