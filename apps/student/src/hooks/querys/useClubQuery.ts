"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllClubs, getDetailClub } from "@/api/club";

export const useGetAllClubsQuery = () => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: getAllClubs,
  });
};

export const useGetDetailClubQuery = (clubId: string) => {
  return useQuery({
    queryKey: ["club", clubId],
    queryFn: () => getDetailClub(clubId),
    enabled: !!clubId,
  });
};
