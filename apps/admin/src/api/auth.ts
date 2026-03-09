import { apiClient } from "utils";

export const logout = async (): Promise<void> => {
  await apiClient.delete("/auth/logout");
};
