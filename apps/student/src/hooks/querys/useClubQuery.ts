"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllClubs, getDetailClub } from "@/api/club";
import { queryKeys } from "@/lib/queryKeys";

export const useGetAllClubsQuery = () => {
  return useQuery({
    queryKey: queryKeys.clubs.all.queryKey,
    queryFn: getAllClubs,
  });
};

export const useGetDetailClubQuery = (clubId: string) => {
  return useQuery({
    queryKey: queryKeys.clubs.detail(clubId).queryKey,
    queryFn: () => getDetailClub(clubId),
    enabled: !!clubId,
  });
};
