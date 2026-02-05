"use client";

import { useQuery } from "@tanstack/react-query";
import { getClubAlarms } from "@/api/alarm";

export const useGetClubAlarmsQuery = () => {
  return useQuery({
    queryKey: ["clubAlarms"],
    queryFn: getClubAlarms,
  });
};
