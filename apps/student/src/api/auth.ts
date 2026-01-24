import type { LoginRequest, LoginResponse } from "utils";
import { apiClient } from "utils";
import { saveTokens } from "@/lib/token";

export const login = async ({
  account_id,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    account_id,
    password,
  });

  saveTokens(response.data);

  return response.data;
};

export const logout = async () => {
  await apiClient.delete("/auth/logout");
};
