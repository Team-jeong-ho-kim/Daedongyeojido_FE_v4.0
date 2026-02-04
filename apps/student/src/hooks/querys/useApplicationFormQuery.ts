"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getApplicationFormDetail,
  getClubApplicationForms,
  getMyApplications,
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

export const useGetMyApplicationsQuery = () => {
  return useQuery({
    queryKey: ["myApplications"],
    queryFn: () => getMyApplications(),
  });
};
