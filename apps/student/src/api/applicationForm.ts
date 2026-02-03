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

export interface ApplicationFormListItem {
  applicationFormId: number;
  applicationFormTitle: string;
  clubName: string;
  clubImage?: string;
  submissionDuration?: [number, number, number] | string;
}

export interface ApplicationFormsResponse {
  applicationForms: ApplicationFormListItem[];
}

export interface ApplicationQuestion {
  applicationQuestionId: number;
  content: string;
}

export interface ApplicationFormDetail {
  applicationFormTitle: string;
  clubName: string;
  clubImage?: string;
  content: ApplicationQuestion[];
  submissionDuration?: [number, number, number] | string;
  major?: string[];
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

export const getClubApplicationForms = async (
  clubId: string,
): Promise<ApplicationFormListItem[]> => {
  const response = await apiClient.get<ApplicationFormsResponse>(
    `/application-forms/clubs/${clubId}`,
  );
  return response.data.applicationForms;
};

export const getApplicationFormDetail = async (
  applicationFormId: string,
): Promise<ApplicationFormDetail> => {
  const response = await apiClient.get<ApplicationFormDetail>(
    `/application-forms/${applicationFormId}`,
  );
  return response.data;
};

export const deleteApplicationForm = async (
  applicationFormId: string,
): Promise<void> => {
  await apiClient.delete(`/application-forms/${applicationFormId}`);
};
