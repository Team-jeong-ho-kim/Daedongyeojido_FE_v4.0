import { apiClient } from "utils";

export interface StudentOnePagerComment {
  commentWriter: string;
  comment: string;
}

export interface StudentOnePagerSubmissionItem {
  submissionId: number; // ID for cancellation
  clubName: string;
  onePagerState: "SUBMITTED" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "CANCELED";
  submitFileUrl: string;
  submitDate: string;
  submitComments: StudentOnePagerComment[];
}

export interface StudentOnePagerDetailResponse {
  title: string;
  description: string;
  onePagerDurationType: "INFINITY" | "DATE";
  onePagerDuration: string | null;
  fileUrl: string | null;
  formUrl: string | null;
  submitOnePagers: StudentOnePagerSubmissionItem[];
}

export const getStudentOnePagerDetail = async (formId: string) => {
  const response = await apiClient.get<StudentOnePagerDetailResponse>(
    `/onepager/forms/${formId}`,
  );
  return response.data;
};

export const submitOnePager = async (formId: string, file: File) => {
  const formData = new FormData();
  formData.append("submitFile", file);

  await apiClient.post(`/onepager/submissions/${formId}`, formData);
};

export const cancelOnePager = async (submissionId: number) => {
  await apiClient.post(`/onepager/submissions/${submissionId}/cancel`);
};
