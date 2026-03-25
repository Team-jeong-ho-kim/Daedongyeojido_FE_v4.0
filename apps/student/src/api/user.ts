import type { UserInfo } from "shared";
import { apiClient } from "utils";
import type { UpdateMyInfoRequest, UpdateProfileRequest } from "@/types";

const appendArrayField = (
  formData: FormData,
  key: string,
  values: string[],
) => {
  const normalizedValues = [
    ...new Set(values.map((value) => value.trim())),
  ].filter(Boolean);

  for (const value of normalizedValues) {
    formData.append(key, value);
  }
};

export const getMyInfo = async () => {
  const response = await apiClient.get<UserInfo>("/users");
  return response.data;
};

export const updateMyInfo = async (data: UpdateMyInfoRequest) => {
  const formData = new FormData();

  formData.append("introduction", data.introduction);

  if (data.phoneNumber) {
    formData.append("phoneNumber", data.phoneNumber);
  }

  appendArrayField(formData, "majors", data.majors);
  appendArrayField(formData, "links", data.links);

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

export const updateProfile = async (data: UpdateProfileRequest) => {
  const formData = new FormData();

  formData.append("introduction", data.introduction);

  appendArrayField(formData, "majors", data.majors);
  appendArrayField(formData, "links", data.links);

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
