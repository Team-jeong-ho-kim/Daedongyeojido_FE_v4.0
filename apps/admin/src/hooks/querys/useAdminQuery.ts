"use client";

import { useQuery } from "@tanstack/react-query";
import {
  downloadClubCreationApplicationForm,
  getClubCreationApplications,
  getResultDuration,
} from "@/api/admin";
import { loadAdminOverviewData } from "@/app/mypage/_lib";
import { queryKeys } from "@/lib";

export const useGetAdminOverviewQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.admin.overview.queryKey,
    queryFn: loadAdminOverviewData,
    enabled,
  });
};

export const useGetResultDurationQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.admin.resultDuration.queryKey,
    queryFn: getResultDuration,
    enabled,
  });
};

export const useGetClubCreationDownloadQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.admin.clubCreationDownload.queryKey,
    queryFn: downloadClubCreationApplicationForm,
    enabled,
  });
};

export const useGetClubCreationApplicationsQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.admin.clubCreationApplications.queryKey,
    queryFn: getClubCreationApplications,
    enabled,
    select: (clubs) => [...clubs].sort((a, b) => b.clubId - a.clubId),
  });
};
