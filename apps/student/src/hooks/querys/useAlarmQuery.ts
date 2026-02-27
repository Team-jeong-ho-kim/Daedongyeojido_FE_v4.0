"use client";

import { useQuery } from "@tanstack/react-query";
import { getClubAlarms } from "@/api/alarm";
import { queryKeys } from "@/lib/queryKeys";

export const useGetClubAlarmsQuery = () => {
  return useQuery({
    queryKey: queryKeys.alarms.club.queryKey,
    queryFn: getClubAlarms,
  });
};
