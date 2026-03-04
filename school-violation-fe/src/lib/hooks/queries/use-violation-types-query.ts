import { useQuery } from "@tanstack/react-query";
import { fetchViolationTypes } from "@/lib/apis/violation-types";

export function useViolationTypesQuery() {
  return useQuery({
    queryKey: ["violation-types"],
    queryFn: fetchViolationTypes,
    staleTime: 1000 * 30,
  });
}
