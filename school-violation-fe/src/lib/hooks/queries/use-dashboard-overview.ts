import { useQuery } from "@tanstack/react-query";
import { fetchDashboardOverview } from "@/lib/apis/statistics";

export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: fetchDashboardOverview,
    staleTime: 1000 * 60, // 1 menit
  });
}
