import { useQuery } from "@tanstack/react-query";
import { fetchViolations } from "@/lib/apis/violations";
import type {
  PaginatedViolations,
  ViolationListParams,
} from "@/app/(admin)/admin/violations/helper";

export function useViolationsQuery(params: ViolationListParams) {
  return useQuery<PaginatedViolations>({
    queryKey: ["violations", params],
    queryFn: () => fetchViolations(params),
    staleTime: 1000 * 10, // 10 detik
  });
}
