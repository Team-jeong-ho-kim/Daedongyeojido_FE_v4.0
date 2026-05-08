import { apiClient } from "./instance";

export interface OnePager {
  onePagerFormId: number;
  title: string;
  teacherName: string;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration: string | null;
}
export interface OnePagerListResponse {
  onePagers: OnePager[];
}

export const getOnePagers = async (): Promise<OnePager[]> => {
  const response = await apiClient.get<OnePagerListResponse>("/onepager/forms");
  return response.data.onePagers;
};
export const createFileOnePager = async (
  payload: CreateFileOnePagerRequest,
): Promise<{ onePagerFormId: number }> => {
  const formData = new FormData();
};
