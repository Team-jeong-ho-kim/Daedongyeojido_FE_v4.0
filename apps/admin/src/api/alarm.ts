import { apiClient } from "utils";
import type { AdminAlarm, AdminAlarmsResponse } from "@/types/admin";

export const getUserAlarms = async (): Promise<AdminAlarm[]> => {
  const response = await apiClient.get<AdminAlarmsResponse>("/alarms/users");
  return response.data.alarms;
};
