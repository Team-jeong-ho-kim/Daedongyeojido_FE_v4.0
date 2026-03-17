import { apiClient } from "utils";
import type { AdminTeachersResponse } from "@/types/admin";

interface addTeacherRequestType {
  accountId: string;
  password: string;
  teacherName: string;
}

export const getAllTeachers = async () => {
  const response = await apiClient.get<AdminTeachersResponse>("/teachers");
  return response.data.teachers;
};

export const addTeacher = async (
  data: addTeacherRequestType,
): Promise<void> => {
  await apiClient.post("/admin/teachers", data);
};
