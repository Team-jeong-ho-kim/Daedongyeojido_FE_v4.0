import { apiClient } from "utils";

interface addTeacherRequestType {
  accountId: string;
  password: string;
  teacherName: string;
}

export const addTeacher = async (
  data: addTeacherRequestType,
): Promise<void> => {
  await apiClient.post("/admin/teachers", data);
};
