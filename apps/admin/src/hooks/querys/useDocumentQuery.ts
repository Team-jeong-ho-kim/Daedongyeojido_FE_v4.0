"use client";

import { useQuery } from "@tanstack/react-query";
import { getDocumentFiles } from "@/api/document";
import { queryKeys } from "@/lib";

export const useGetDocumentFilesQuery = () => {
  return useQuery({
    queryKey: queryKeys.admin.documentFiles.queryKey,
    queryFn: getDocumentFiles,
  });
};
