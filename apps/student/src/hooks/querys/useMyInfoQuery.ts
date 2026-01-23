import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserStore } from "shared";
import { getMyInfo } from "@/api/user";

interface UseMyInfoOptions {
  enabled?: boolean;
}

export const useMyInfoQuery = (options?: UseMyInfoOptions) => {
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const query = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (query.data) {
      setUserInfo(query.data);
    }
  }, [query.data, setUserInfo]);

  return query;
};
