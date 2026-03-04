import { useQuery } from "@tanstack/react-query";
import { fetchAdminReports } from "@/lib/apis/reports";
import type {
  PaginatedReports,
  ReportListParams,
} from "@/app/(admin)/admin/reports/helper";

export function useAdminReportsQuery(params: ReportListParams) {
  return useQuery<PaginatedReports>({
    queryKey: ["admin-reports", params],
    queryFn: () => fetchAdminReports(params),
    staleTime: 1000 * 10,
  });
}
