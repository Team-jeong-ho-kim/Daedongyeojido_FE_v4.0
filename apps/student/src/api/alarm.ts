import { apiClient } from "utils";
import type { ClubAlarmsResponse } from "@/types";

export const getClubAlarms = async () => {
  const response = await apiClient.get<ClubAlarmsResponse>("/alarms/clubs");
  return response.data.alarms;
};
