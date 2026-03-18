import type { ClubCreationApplicationDetail } from "utils";
import { apiClient } from "utils";

type CreateClubCreationApplicationInput = {
  clubCreationForm: File;
  clubImage?: File | null;
  clubName: string;
  introduction: string;
  link?: string[];
  major: string[];
  oneLiner: string;
  teacherId: number;
};

type UpdateClubCreationApplicationInput = {
  applicationId: number;
  clubCreationForm?: File | null;
  clubImage?: File | null;
  clubName?: string;
  introduction?: string;
  link?: string[];
  major?: string[];
  oneLiner?: string;
};

const appendStringArray = (
  formData: FormData,
  key: "link" | "major",
  values: string[],
) => {
  [...new Set(values.map((value) => value.trim()).filter(Boolean))].forEach(
    (value) => {
      formData.append(key, value);
    },
  );
};

const buildClubCreationFormData = (
  payload: Omit<CreateClubCreationApplicationInput, "teacherId"> & {
    teacherId?: number;
  },
) => {
  const formData = new FormData();

  if (payload.clubName !== undefined) {
    formData.append("clubName", payload.clubName);
  }
  if (payload.oneLiner !== undefined) {
    formData.append("oneLiner", payload.oneLiner);
  }
  if (payload.introduction !== undefined) {
    formData.append("introduction", payload.introduction);
  }
  if (payload.teacherId !== undefined) {
    formData.append("teacherId", String(payload.teacherId));
  }
  if (payload.major !== undefined) {
    appendStringArray(formData, "major", payload.major);
  }
  if (payload.link !== undefined) {
    appendStringArray(formData, "link", payload.link);
  }
  if (payload.clubImage) {
    formData.append("clubImage", payload.clubImage, payload.clubImage.name);
  }
  if (payload.clubCreationForm) {
    formData.append(
      "clubCreationForm",
      payload.clubCreationForm,
      payload.clubCreationForm.name,
    );
  }

  return formData;
};

export const createClubCreationApplication = async (
  payload: CreateClubCreationApplicationInput,
) => {
  const formData = buildClubCreationFormData(payload);
  const response = await apiClient.post("/clubs/applications", formData);
  return response.data;
};

export const getMyClubCreationApplication = async () => {
  const response = await apiClient.get<ClubCreationApplicationDetail>(
    "/club-creation-applications/me",
  );

  return response.data;
};

export const updateClubCreationApplication = async ({
  applicationId,
  ...payload
}: UpdateClubCreationApplicationInput) => {
  const formData = buildClubCreationFormData(payload);
  const response = await apiClient.patch(
    `/club-creation-applications/${applicationId}`,
    formData,
  );

  return response.data;
};

export const submitClubCreationApplication = async (applicationId: number) => {
  const response = await apiClient.post(
    `/club-creation-applications/${applicationId}/submit`,
  );

  return response.data;
};
