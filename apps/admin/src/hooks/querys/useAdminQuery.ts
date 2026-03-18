"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getClubCreationApplicationDetail,
  getClubCreationApplications,
  getResultDuration,
} from "@/api/admin";
import { getAllTeachers } from "@/api/teacher";
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

export const useGetAllTeachersQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.admin.teachers.queryKey,
    queryFn: getAllTeachers,
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (teachers) =>
      [...teachers].sort((a, b) => a.teacherId - b.teacherId),
  });
};

export const useGetClubCreationApplicationsQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.admin.clubCreationApplications.queryKey,
    queryFn: getClubCreationApplications,
    enabled,
    select: (applications) =>
      [...applications].sort((a, b) => {
        return (
          new Date(b.lastSubmittedAt).getTime() -
          new Date(a.lastSubmittedAt).getTime()
        );
      }),
  });
};

export const useGetClubCreationApplicationDetailQuery = (
  applicationId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey:
      queryKeys.admin.clubCreationApplicationDetail(applicationId).queryKey,
    queryFn: () => getClubCreationApplicationDetail(applicationId),
    enabled: enabled && !!applicationId,
  });
};
