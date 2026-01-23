import { apiClient } from "utils";
import type { UserInfo } from "shared";

export const getMyInfo = async (): Promise<UserInfo> => {
  const response = await apiClient.get<UserInfo>("/users/me");
  return response.data;
};
