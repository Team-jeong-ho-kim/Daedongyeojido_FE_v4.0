"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getApplicationFormDetail,
  getClubApplicationForms,
} from "@/api/applicationForm";

export const useGetClubApplicationFormsQuery = (clubId: string) => {
  return useQuery({
    queryKey: ["applicationForms", clubId],
    queryFn: () => getClubApplicationForms(clubId),
    enabled: !!clubId,
  });
};

export const useGetApplicationFormDetailQuery = (applicationFormId: string) => {
  return useQuery({
    queryKey: ["applicationForm", applicationFormId],
    queryFn: () => getApplicationFormDetail(applicationFormId),
    enabled: !!applicationFormId,
  });
};
