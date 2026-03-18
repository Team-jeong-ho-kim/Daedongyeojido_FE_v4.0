"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyClubCreationApplication } from "@/api/clubCreation";
import { queryKeys } from "@/lib/queryKeys";

interface UseMyClubCreationApplicationOptions {
  enabled?: boolean;
}

export const useGetMyClubCreationApplicationQuery = (
  options?: UseMyClubCreationApplicationOptions,
) => {
  return useQuery({
    queryKey: queryKeys.clubCreationApplication.me.queryKey,
    queryFn: getMyClubCreationApplication,
    enabled: options?.enabled ?? true,
    retry: false,
  });
};
