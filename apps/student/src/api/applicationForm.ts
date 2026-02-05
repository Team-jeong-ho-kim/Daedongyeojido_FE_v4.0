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
  applicantId: number;
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  answers: SubmissionAnswer[];
  hasInterviewSchedule: boolean;
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

export interface MySubmissionHistoryItem {
  submissionId: number;
  clubName: string;
  clubImage?: string;
  applicationStatus: string;
  submissionDuration: string | [number, number, number];
}

export interface MySubmissionHistoryResponse {
  submissions: MySubmissionHistoryItem[];
}

export const getMySubmissionHistory = async (): Promise<
  MySubmissionHistoryItem[]
> => {
  const response =
    await apiClient.get<MySubmissionHistoryResponse>("/users/submissions");
  return response.data.submissions;
};

export interface MySubmissionAnswer {
  applicationQuestionId: number;
  question: string;
  applicationAnswerId: number;
  answer: string;
}

export interface MySubmissionDetail {
  clubName: string;
  clubImage?: string;
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  contents: MySubmissionAnswer[];
  submissionDuration: string | [number, number, number];
  applicationStatus?: "WRITING" | "SUBMITTED" | "ACCEPTED" | "REJECTED";
}

export const getMySubmissionDetail = async (
  submissionId: string,
): Promise<MySubmissionDetail> => {
  const response = await apiClient.get<MySubmissionDetail>(
    `/applications/${submissionId}`,
  );
  return response.data;
};

export interface UpdateMySubmissionRequest {
  userName: string;
  classNumber: string;
  introduction: string;
  major: string;
  answer: {
    applicationQuestionId: number;
    answer: string;
  }[];
}

export const updateMySubmission = async (
  submissionId: string,
  data: UpdateMySubmissionRequest,
): Promise<void> => {
  await apiClient.patch(`/applications/${submissionId}`, data);
};

export const submitMySubmission = async (
  submissionId: string,
): Promise<void> => {
  await apiClient.patch(`/applications/submit/${submissionId}`);
};

export const deleteMySubmission = async (
  submissionId: string,
): Promise<void> => {
  await apiClient.delete(`/applications/${submissionId}`);
};

export interface CreateInterviewScheduleRequest {
  interviewSchedule: string;
  place: string;
  interviewTime: string;
}

export const createInterviewSchedule = async (
  userId: string,
  data: CreateInterviewScheduleRequest,
): Promise<void> => {
  await apiClient.post(`/schedules/${userId}`, data);
};

export interface InterviewScheduleDetail {
  scheduleId: number;
  userName: string;
  classNumber: string;
  major: string;
  place: string;
  interviewTime: string;
  interviewSchedule: string;
}

export const getInterviewSchedule = async (
  applicantId: string,
): Promise<InterviewScheduleDetail> => {
  const response = await apiClient.get<InterviewScheduleDetail>(
    `/schedules/${applicantId}`,
  );
  return response.data;
};

export interface UpdateInterviewScheduleRequest {
  interviewSchedule: string;
  place: string;
  interviewTime: string;
}

export const updateInterviewSchedule = async (
  scheduleId: string,
  data: UpdateInterviewScheduleRequest,
): Promise<void> => {
  await apiClient.patch(`/schedules/${scheduleId}`, data);
};

export interface DecidePassRequest {
  isPassed: boolean;
}

export const decidePass = async (
  submissionId: string,
  data: DecidePassRequest,
): Promise<void> => {
  await apiClient.patch(`/clubs/pass/${submissionId}`, data);
};
