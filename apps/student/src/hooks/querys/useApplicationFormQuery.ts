"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getApplicationFormDetail,
  getClubApplicationForms,
  getDocumentFiles,
  getMyApplications,
  getMySubmissionDetail,
  getMySubmissionHistory,
  getResultDuration,
  getUserAlarms,
} from "@/api/applicationForm";
import { queryKeys } from "@/lib/queryKeys";

export const useGetClubApplicationFormsQuery = (clubId: string) => {
  return useQuery({
    queryKey: queryKeys.applicationForms.byClub(clubId).queryKey,
    queryFn: () => getClubApplicationForms(clubId),
    enabled: !!clubId,
    refetchOnMount: true,
  });
};

export const useGetApplicationFormDetailQuery = (applicationFormId: string) => {
  return useQuery({
    queryKey: queryKeys.applicationForms.detail(applicationFormId).queryKey,
    queryFn: () => getApplicationFormDetail(applicationFormId),
    enabled: !!applicationFormId,
  });
};

export const useGetDocumentFilesQuery = () => {
  return useQuery({
    queryKey: queryKeys.applicationForms.files.queryKey,
    queryFn: getDocumentFiles,
  });
};

export const useGetMyApplicationsQuery = () => {
  return useQuery({
    queryKey: queryKeys.applications.mine.queryKey,
    queryFn: () => getMyApplications(),
  });
};

export const useGetMySubmissionHistoryQuery = () => {
  return useQuery({
    queryKey: queryKeys.applications.history.queryKey,
    queryFn: () => getMySubmissionHistory(),
  });
};

export const useGetMySubmissionDetailQuery = (submissionId: string) => {
  return useQuery({
    queryKey: queryKeys.applications.mySubmission(submissionId).queryKey,
    queryFn: () => getMySubmissionDetail(submissionId),
    enabled: !!submissionId,
  });
};

export const useResultDurationQuery = () => {
  return useQuery({
    queryKey: queryKeys.result.duration.queryKey,
    queryFn: () => getResultDuration(),
  });
};

export const useGetUserAlarmsQuery = () => {
  return useQuery({
    queryKey: queryKeys.alarms.user.queryKey,
    queryFn: () => getUserAlarms(),
  });
};
