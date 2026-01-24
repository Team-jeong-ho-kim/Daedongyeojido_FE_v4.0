import { useQuery } from "@tanstack/react-query";
import { getAllClubs } from "@/api/club";

export const useGetAllClubsQuery = () => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: getAllClubs,
  });
};
