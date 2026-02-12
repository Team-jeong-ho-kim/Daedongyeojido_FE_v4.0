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
  imageFile: File,
  imageChanged: boolean,
) => {
  const formData = new FormData();

  formData.append("clubName", data.clubName);
  formData.append("oneLiner", data.oneLiner);
  formData.append("introduction", data.introduction);

  // 중복 제거
  [...new Set(data.major)].forEach((m) => {
    formData.append("major", m);
  });

  // 중복 제거
  [...new Set(data.link)].forEach((l) => {
    formData.append("link", l);
  });

  // 이미지는 무조건 포함 (변경되지 않은 경우 빈 더미 파일)
  formData.append("clubImage", imageFile);

  // 이미지 변경 여부 플래그
  formData.append("imageChanged", imageChanged.toString());

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

export const createClubApplication = async (
  clubName: string,
  oneLiner: string,
  introduction: string,
  major: string[],
  link: string[],
  clubImage: File,
) => {
  const formData = new FormData();

  formData.append("clubName", clubName);
  formData.append("oneLiner", oneLiner);
  formData.append("introduction", introduction);

  major.forEach((m) => {
    formData.append("major", m);
  });

  link.forEach((l) => {
    formData.append("link", l);
  });

  formData.append("clubImage", clubImage);

  const response = await apiClient.post("/clubs/applications", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteClubMember = async (userId: string) => {
  const response = await apiClient.delete(`/clubs/members/${userId}`);
  return response.data;
};

export const requestAddClubMember = async (
  userName: string,
  classNumber: string,
) => {
  const response = await apiClient.post("/clubs/members", {
    userName,
    classNumber,
  });
  return response.data;
};
