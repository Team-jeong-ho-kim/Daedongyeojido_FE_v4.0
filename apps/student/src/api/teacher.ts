import { apiClient } from "utils";
import type { TeachersResponse } from "@/types";

export const getAllTeachers = async () => {
  const response = await apiClient.get<TeachersResponse>("/teachers");
  return response.data.teachers;
};
