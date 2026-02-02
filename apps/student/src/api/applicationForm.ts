import { apiClient } from "utils";

export interface CreateApplicationFormRequest {
  applicationFormTitle: string;
  content: string[];
  submissionDuration: string;
  majors: string[];
}

export interface ApplicationForm {
  id: number;
  applicationFormTitle: string;
  content: string[];
  submissionDuration: string;
  majors: string[];
  createdAt: string;
  updatedAt: string;
}

export const createApplicationForm = async (
  data: CreateApplicationFormRequest,
): Promise<ApplicationForm> => {
  const response = await apiClient.post<ApplicationForm>(
    "/application-forms",
    data,
  );
  return response.data;
};
