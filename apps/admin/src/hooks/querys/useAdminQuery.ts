"use client";

import { useQuery } from "@tanstack/react-query";
import {
  downloadClubCreationApplicationForm,
  getClubCreationForm,
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

export const useGetClubCreationFormQuery = (clubId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.admin.clubCreationForm(clubId).queryKey,
    queryFn: () => getClubCreationForm(clubId),
    enabled: enabled && !!clubId,
  });
};

export const useGetClubCreationDownloadQuery = (
  clubCreationFormId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.admin.clubCreationDownload(clubCreationFormId).queryKey,
    queryFn: () => downloadClubCreationApplicationForm(clubCreationFormId),
    enabled: enabled && !!clubCreationFormId,
  });
};
