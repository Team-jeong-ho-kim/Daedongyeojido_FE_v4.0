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

export interface SubmitApplicationRequest {
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  answer: {
    applicationQuestionId: number;
    answer: string;
  }[];
}

export const submitApplication = async (
  applicationFormId: string,
  data: SubmitApplicationRequest,
): Promise<void> => {
  const response = await apiClient.post(
    `/applications/${applicationFormId}`,
    data,
  );
  return response.data;
};

export interface ApplicationSubmission {
  submissionId: number;
  userName: string;
  classNumber: string;
  major: string[] | string;
}

export interface ApplicationSubmissionsResponse {
  applicants: ApplicationSubmission[];
}

export const getApplicationSubmissions = async (
  applicationFormId: string,
): Promise<ApplicationSubmission[]> => {
  const response = await apiClient.get<ApplicationSubmissionsResponse>(
    `/clubs/submissions/all/${applicationFormId}`,
  );
  return response.data.applicants;
};

export interface SubmissionAnswer {
  questionId: number;
  questionContent: string;
  content: string;
}

export interface SubmissionDetail {
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  answers: SubmissionAnswer[];
}

export const getSubmissionDetail = async (
  submissionId: string,
): Promise<SubmissionDetail> => {
  const response = await apiClient.get<SubmissionDetail>(
    `/clubs/submissions/${submissionId}`,
  );
  return response.data;
};

export interface MyApplication {
  submissionId: number;
  clubName: string;
  clubImage?: string;
  applicationStatus: "WRITING" | "SUBMITTED";
  submissionDuration: string | [number, number, number];
}

export interface MyApplicationsResponse {
  applications: MyApplication[];
}

export const getMyApplications = async (): Promise<MyApplication[]> => {
  const response = await apiClient.get<MyApplicationsResponse>("/applications");
  return response.data.applications;
};
