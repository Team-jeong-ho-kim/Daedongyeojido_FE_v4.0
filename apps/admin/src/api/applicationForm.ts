import { apiClient } from "utils";
import type {
  ApplicationFormListItem,
  ApplicationFormsResponse,
} from "@/types/admin";

export const getAllApplicationForms = async (): Promise<
  ApplicationFormListItem[]
> => {
  const response =
    await apiClient.get<ApplicationFormsResponse>("/application-forms");
  return response.data.applicationForms;
};

export const getClubApplicationForms = async (
  clubId: string,
): Promise<ApplicationFormListItem[]> => {
  const response = await apiClient.get<ApplicationFormsResponse>(
    `/application-forms/clubs/${clubId}`,
  );
  return response.data.applicationForms;
};
