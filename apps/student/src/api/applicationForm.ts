import { apiClient } from "utils";
import type {
  Alarm,
  AlarmsResponse,
  ApplicationForm,
  ApplicationFormDetail,
  ApplicationFormListItem,
  ApplicationFormsResponse,
  ApplicationSubmission,
  ApplicationSubmissionsResponse,
  CreateApplicationFormRequest,
  CreateInterviewScheduleRequest,
  DecidePassRequest,
  InterviewScheduleDetail,
  MyApplication,
  MyApplicationsResponse,
  MySubmissionDetail,
  MySubmissionHistoryItem,
  MySubmissionHistoryResponse,
  ResultDurationResponse,
  SubmissionDetail,
  SubmitApplicationRequest,
  UpdateInterviewScheduleRequest,
  UpdateMySubmissionRequest,
} from "@/types";

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

export const getApplicationSubmissions = async (
  applicationFormId: string,
): Promise<ApplicationSubmission[]> => {
  const response = await apiClient.get<ApplicationSubmissionsResponse>(
    `/clubs/submissions/all/${applicationFormId}`,
  );
  return response.data.applicants;
};

export const getSubmissionDetail = async (
  submissionId: string,
): Promise<SubmissionDetail> => {
  const response = await apiClient.get<SubmissionDetail>(
    `/clubs/submissions/${submissionId}`,
  );
  return response.data;
};

export const getMyApplications = async (): Promise<MyApplication[]> => {
  const response = await apiClient.get<MyApplicationsResponse>("/applications");
  return response.data.applications;
};

export const getMySubmissionHistory = async (): Promise<
  MySubmissionHistoryItem[]
> => {
  const response =
    await apiClient.get<MySubmissionHistoryResponse>("/users/submissions");
  return response.data.submissions;
};

export const getMySubmissionDetail = async (
  submissionId: string,
): Promise<MySubmissionDetail> => {
  const response = await apiClient.get<MySubmissionDetail>(
    `/applications/${submissionId}`,
  );
  return response.data;
};

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

export const cancelMySubmission = async (
  submissionId: string,
): Promise<void> => {
  await apiClient.patch(`/applications/cancel/${submissionId}`);
};

export const createInterviewSchedule = async (
  userId: string,
  data: CreateInterviewScheduleRequest,
): Promise<void> => {
  await apiClient.post(`/schedules/${userId}`, data);
};

export const getInterviewSchedule = async (
  applicantId: string,
): Promise<InterviewScheduleDetail> => {
  const response = await apiClient.get<InterviewScheduleDetail>(
    `/schedules/${applicantId}`,
  );
  return response.data;
};

export const updateInterviewSchedule = async (
  scheduleId: string,
  data: UpdateInterviewScheduleRequest,
): Promise<void> => {
  await apiClient.patch(`/schedules/${scheduleId}`, data);
};

export const decidePass = async (
  submissionId: string,
  data: DecidePassRequest,
): Promise<void> => {
  await apiClient.patch(`/clubs/pass/${submissionId}`, data);
};

export const getResultDuration =
  async (): Promise<ResultDurationResponse | null> => {
    try {
      const response =
        await apiClient.get<ResultDurationResponse>("/result-duration");
      return response.data;
    } catch {
      return null;
    }
  };

export const getUserAlarms = async (): Promise<Alarm[]> => {
  const response = await apiClient.get<AlarmsResponse>("/alarms/users");
  return response.data.alarms;
};
