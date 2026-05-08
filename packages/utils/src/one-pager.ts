import { apiClient } from "./instance";

export interface OnePager {
  onePagerFormId: number;
  title: string;
  teacherName: string;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration: string | null;
}

export interface CreateFileOnePagerRequest {
  title: string;
  formFile: File;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration?: string;
  description: string;
}

export interface CreateUrlOnePagerRequest {
  title: string;
  formUrl: string;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration?: string;
  description: string;
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
  formData.append("title", payload.title);
  formData.append("formFile", payload.formFile);
  formData.append("onePagerDurationType", payload.onePagerDurationType);
  if (payload.onePagerDuration) {
    formData.append("onePagerDuration", payload.onePagerDuration);
  }
  formData.append("description", payload.description);

  const response = await apiClient.post<{ onePagerFormId: number }>(
    "/teachers/onepager/forms-file",
    formData,
  );
  return response.data;
};

export const createUrlOnePager = async (
  payload: CreateUrlOnePagerRequest,
): Promise<{ onePagerFormId: number }> => {
  const response = await apiClient.post<{ onePagerFormId: number }>(
    "/teachers/onepager/forms-url",
    payload,
  );
  return response.data;
};
