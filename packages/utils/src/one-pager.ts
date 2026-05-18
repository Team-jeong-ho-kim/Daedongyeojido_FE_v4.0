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

export interface UpdateFileOnePagerRequest extends CreateFileOnePagerRequest {
  teacherName: string;
}

export interface UpdateUrlOnePagerRequest extends CreateUrlOnePagerRequest {
  teacherName: string;
}

export const updateFileOnePager = async (
  formId: string,
  payload: UpdateFileOnePagerRequest,
): Promise<void> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("teacherName", payload.teacherName);
  formData.append("formFile", payload.formFile);
  formData.append("onePagerDurationType", payload.onePagerDurationType);
  if (payload.onePagerDuration) {
    formData.append("onePagerDuration", payload.onePagerDuration);
  }
  formData.append("description", payload.description);

  await apiClient.patch(`/teachers/onepager/forms-file/${formId}`, formData);
};

export const updateUrlOnePager = async (
  formId: string,
  payload: UpdateUrlOnePagerRequest,
): Promise<void> => {
  await apiClient.patch(`/teachers/onepager/forms-url/${formId}`, payload);
};

export interface OnePagerListResponse {
  onePagers: OnePager[];
}

export const getOnePagers = async (): Promise<OnePager[]> => {
  const response = await apiClient.get<OnePagerListResponse>("/onepager/forms");
  return response.data.onePagers;
};
export const createFileOnePager = async (
  payload: CreateFileOnePagerRequest,
): Promise<{ onePagerId: number }> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("formFile", payload.formFile);
  formData.append("onePagerDurationType", payload.onePagerDurationType);
  if (payload.onePagerDuration) {
    formData.append("onePagerDuration", payload.onePagerDuration);
  }
  formData.append("description", payload.description);

  const response = await apiClient.post<{ onePagerId: number }>(
    "/teachers/onepager/forms-file",
    formData,
  );
  return { onePagerId: response.data.onePagerId };
};

export const createUrlOnePager = async (
  payload: CreateUrlOnePagerRequest,
): Promise<{ onePagerId: number }> => {
  const response = await apiClient.post<{ onePagerId: number }>(
    "/teachers/onepager/forms-url",
    payload,
  );
  return { onePagerId: response.data.onePagerId };
};
