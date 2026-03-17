import { apiClient } from "utils";
import type {
  TeacherClubCreationApplicationDetailResponse,
  TeacherMyInfoResponse,
} from "@/types/teacher";

export const getTeacherMyInfo = async () => {
  const response = await apiClient.get<TeacherMyInfoResponse>(
    "/teachers/my-info",
  );

  return response.data;
};

export const getTeacherClubCreationApplicationDetail = async (
  clubId: string,
) => {
  const response =
    await apiClient.get<TeacherClubCreationApplicationDetailResponse>(
      `/admin/club-creation-application/${clubId}`,
    );

  return response.data;
};
