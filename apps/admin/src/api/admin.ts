import { apiClient } from "utils";
import type {
  AdminClubCreationForm,
  ResultDurationResponse,
} from "@/types/admin";

export const getResultDuration = async (): Promise<ResultDurationResponse> => {
  const response =
    await apiClient.get<ResultDurationResponse>("/result-duration");
  return response.data;
};

export const setResultDuration = async (payload: {
  resultDuration: string;
}): Promise<void> => {
  await apiClient.post("/admin/result-duration", payload);
};

export const updateResultDuration = async (
  resultDurationId: string,
  payload: {
    resultDuration: string;
  },
): Promise<void> => {
  await apiClient.patch(`/admin/result-duration/${resultDurationId}`, payload);
};

export const decideClubApplication = async (
  clubId: string,
  isApproved: boolean,
): Promise<void> => {
  await apiClient.patch(`/admin/clubs/applications/${clubId}`, { isApproved });
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

export const uploadClubCreationForm = async (payload: {
  name: string;
  file: File;
}): Promise<void> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("file", payload.file, payload.file.name);

  await apiClient.post("/admin/club-creation-form", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteClubCreationForm = async (
  clubCreationFormId: string,
): Promise<void> => {
  await apiClient.delete(`/admin/club-creation-form/${clubCreationFormId}`);
};
