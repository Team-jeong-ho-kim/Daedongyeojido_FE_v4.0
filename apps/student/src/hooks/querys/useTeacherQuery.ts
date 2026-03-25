"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTeachers } from "@/api/teacher";
import { queryKeys } from "@/lib/queryKeys";

interface UseGetAllTeachersOptions {
  enabled?: boolean;
}

export const useGetAllTeachersQuery = (options?: UseGetAllTeachersOptions) => {
  return useQuery({
    queryKey: queryKeys.teachers.all.queryKey,
    queryFn: getAllTeachers,
    staleTime: 0,
    refetchOnMount: "always",
    enabled: options?.enabled ?? true,
  });
};
