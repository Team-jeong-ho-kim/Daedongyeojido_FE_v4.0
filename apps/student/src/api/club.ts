import { apiClient } from "utils";
import type { ClubsResponse } from "@/types";

export const getAllClubs = async () => {
  const response = await apiClient.get<ClubsResponse>("/clubs");
  return response.data.clubs;
};
