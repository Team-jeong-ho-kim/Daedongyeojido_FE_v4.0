import type { UserInfo } from "shared";
import { apiClient } from "utils";

export const getMyInfo = async () => {
  const response = await apiClient.get<UserInfo>("/users");
  return response.data;
};

export interface UpdateMyInfoRequest {
  introduction: string;
  phoneNumber?: string;
  majors: string[];
  links: string[];
  profileImage?: File | null;
}

export const updateMyInfo = async (data: UpdateMyInfoRequest) => {
  const formData = new FormData();

  formData.append("introduction", data.introduction);

  if (data.phoneNumber) {
    formData.append("phoneNumber", data.phoneNumber);
  }

  for (const major of data.majors) {
    formData.append("majors", major);
  }

  for (const link of data.links) {
    formData.append("links", link);
  }

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  const response = await apiClient.patch<UserInfo>("/users/my-info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export interface UpdateProfileRequest {
  introduction: string;
  majors: string[];
  links: string[];
  profileImage?: File | null;
  existingImageUrl?: string;
}

export const updateProfile = async (data: UpdateProfileRequest) => {
  const formData = new FormData();

  formData.append("introduction", data.introduction);

  for (const major of data.majors) {
    formData.append("majors", major);
  }

  for (const link of data.links) {
    formData.append("links", link);
  }

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  const response = await apiClient.patch<UserInfo>("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
