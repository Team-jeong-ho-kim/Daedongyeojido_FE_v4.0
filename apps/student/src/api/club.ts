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
  imageFile?: File | null,
) => {
  const formData = new FormData();

  if (data.clubName !== undefined) {
    formData.append("clubName", data.clubName);
  }
  if (data.oneLiner !== undefined) {
    formData.append("oneLiner", data.oneLiner);
  }
  if (data.introduction !== undefined) {
    formData.append("introduction", data.introduction);
  }

  if (data.major !== undefined) {
    [...new Set(data.major)].forEach((m) => {
      formData.append("major", m);
    });
  }

  if (data.link !== undefined) {
    [...new Set(data.link)].forEach((l) => {
      formData.append("link", l);
    });
  }

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

export const createClubApplication = async (
  clubName: string,
  oneLiner: string,
  introduction: string,
  teacherId: number,
  major: string[],
  link: string[],
  clubImage: File,
  clubCreationFormFile: File,
) => {
  const formData = new FormData();

  formData.append("clubName", clubName);
  formData.append("oneLiner", oneLiner);
  formData.append("introduction", introduction);
  formData.append("teacherId", String(teacherId));

  major.forEach((m) => {
    formData.append("major", m);
  });

  [...new Set(link.map((item) => item.trim()).filter(Boolean))].forEach((l) => {
    formData.append("link", l);
  });

  formData.append("clubImage", clubImage);
  formData.append(
    "clubCreationForm",
    clubCreationFormFile,
    clubCreationFormFile.name,
  );

  const response = await apiClient.post("/clubs/applications", formData);
  return response.data;
};

export const deleteClubMember = async (userId: number) => {
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
