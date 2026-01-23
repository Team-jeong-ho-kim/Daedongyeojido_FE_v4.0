import type { UserInfo } from "shared";
import { apiClient } from "utils";

export const getMyInfo = async (): Promise<UserInfo> => {
  const response = await apiClient.get<UserInfo>("/users");
  return response.data;
};
