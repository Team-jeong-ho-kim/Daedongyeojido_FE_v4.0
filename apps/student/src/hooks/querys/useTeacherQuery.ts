"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllTeachers } from "@/api/teacher";
import { queryKeys } from "@/lib/queryKeys";

export const useGetAllTeachersQuery = () => {
  return useQuery({
    queryKey: queryKeys.teachers.all.queryKey,
    queryFn: getAllTeachers,
    staleTime: 5 * 60 * 1000,
  });
};
