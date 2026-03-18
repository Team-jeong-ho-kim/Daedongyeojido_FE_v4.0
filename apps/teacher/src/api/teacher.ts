import { apiClient } from "utils";
import type {
  TeacherClubCreationApplication,
  TeacherClubCreationApplicationDetailResponse,
  TeacherClubCreationApplicationsResponse,
  TeacherClubCreationReviewRequest,
  TeacherMyInfoResponse,
} from "@/types/teacher";

export const getTeacherMyInfo = async () => {
  const response = await apiClient.get<TeacherMyInfoResponse>(
    "/teachers/my-info",
  );

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
