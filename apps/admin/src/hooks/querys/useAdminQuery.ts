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
    select: (clubs) => [...clubs].sort((a, b) => b.clubId - a.clubId),
  });
};

export const useGetClubCreationApplicationDetailQuery = (
  clubId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.admin.clubCreationApplicationDetail(clubId).queryKey,
    queryFn: () => getClubCreationApplicationDetail(clubId),
    enabled: enabled && !!clubId,
  });
};
