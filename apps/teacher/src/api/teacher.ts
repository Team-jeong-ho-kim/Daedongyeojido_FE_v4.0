import { apiClient } from "utils";
import type {
  TeacherAnnouncementDetailResponse,
  TeacherAnnouncementListItem,
  TeacherAnnouncementListResponse,
  TeacherClubAnnouncement,
  TeacherClubAnnouncementResponse,
  TeacherClubCreationApplication,
  TeacherClubCreationApplicationDetailResponse,
  TeacherClubCreationApplicationsResponse,
  TeacherClubCreationReviewRequest,
  TeacherClubDetailResponse,
  TeacherClubSummary,
  TeacherClubsResponse,
  TeacherDocumentFileItem,
  TeacherDocumentFilesResponse,
  TeacherMyInfoResponse,
} from "@/types/teacher";

export const getTeacherMyInfo = async () => {
  const response =
    await apiClient.get<TeacherMyInfoResponse>("/teachers/my-info");

  return response.data;
};

export const getTeacherClubCreationApplications = async (): Promise<
  TeacherClubCreationApplication[]
> => {
  const response = await apiClient.get<TeacherClubCreationApplicationsResponse>(
    "/club-creation-applications",
  );

  return response.data.applications;
};

export const getTeacherClubCreationApplicationDetail = async (
  applicationId: string,
) => {
  const response =
    await apiClient.get<TeacherClubCreationApplicationDetailResponse>(
      `/club-creation-applications/${applicationId}`,
    );

  return response.data;
};

export const reviewTeacherClubCreationApplication = async (
  applicationId: string,
  payload: TeacherClubCreationReviewRequest,
) => {
  await apiClient.put(
    `/club-creation-applications/${applicationId}/review`,
    payload,
  );
};

export const getTeacherClubs = async (): Promise<TeacherClubSummary[]> => {
  const response = await apiClient.get<TeacherClubsResponse>("/clubs");
  return response.data.clubs;
};

export const getTeacherClubDetail = async (clubId: string) => {
  const response = await apiClient.get<TeacherClubDetailResponse>(
    `/clubs/${clubId}`,
  );
  return response.data;
};

export const getTeacherAnnouncements = async (): Promise<
  TeacherAnnouncementListItem[]
> => {
  const response =
    await apiClient.get<TeacherAnnouncementListResponse>("/announcements");
  return response.data.announcements;
};

export const getTeacherAnnouncementDetail = async (announcementId: string) => {
  const response = await apiClient.get<TeacherAnnouncementDetailResponse>(
    `/announcements/${announcementId}`,
  );
  return response.data;
};

export const getTeacherClubAnnouncements = async (
  clubId: number,
): Promise<TeacherClubAnnouncement[]> => {
  const response = await apiClient.get<TeacherClubAnnouncementResponse>(
    `/announcements/clubs/${clubId}`,
  );
  return response.data.clubAnnouncements ?? [];
};

export const getTeacherDocumentFiles = async (): Promise<
  TeacherDocumentFileItem[]
> => {
  const response = await apiClient.get<TeacherDocumentFilesResponse>("/files");
  return response.data.fileResponses ?? [];
};
