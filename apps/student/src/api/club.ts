import { apiClient } from "utils";
import type { ClubDetailResponse, ClubsResponse, ClubUpdate } from "@/types";

export const getAllClubs = async () => {
  const response = await apiClient.get<ClubsResponse>("/clubs");
  return response.data.clubs;
};

export const getDetailClub = async (clubId: string) => {
  const response = await apiClient.get<ClubDetailResponse>(`/clubs/${clubId}`);
  return response.data;
};

export const updateClub = async (
  clubId: string,
  data: ClubUpdate,
  imageFile?: File,
) => {
  const formData = new FormData();

  formData.append("clubName", data.clubName);
  formData.append("oneLiner", data.oneLiner);
  formData.append("introduction", data.introduction);

  data.major.forEach((m) => {
    formData.append("major", m);
  });

  data.link.forEach((l) => {
    formData.append("link", l);
  });

  // MultipartFile이므로 File 객체일 때만 추가
  if (imageFile) {
    formData.append("clubImage", imageFile);
  }

  const response = await apiClient.patch(`/clubs/${clubId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const dissolveClub = async () => {
  const response = await apiClient.post("/clubs/dissolution");
  return response.data;
};
