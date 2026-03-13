import { apiClient } from "utils";
import type { DocumentFilesResponse } from "@/types/admin";

export const getDocumentFiles = async (): Promise<DocumentFilesResponse> => {
  const response = await apiClient.get<DocumentFilesResponse>("/files");
  return response.data;
};
