import { apiClient } from "utils";
import type {
  ApplicationFormListItem,
  ApplicationFormsResponse,
} from "@/types/admin";

export const getClubApplicationForms = async (
  clubId: string,
): Promise<ApplicationFormListItem[]> => {
  const response = await apiClient.get<ApplicationFormsResponse>(
    `/application-forms/clubs/${clubId}`,
  );
  return response.data.applicationForms;
};
