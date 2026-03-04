import api from "@/lib/http";
import type { DashboardOverview } from "@/app/(admin)/admin/dashboard/helper";

export async function fetchDashboardOverview() {
  const res = await api.get("/admin/statistics/overview");
  const body = res.data;

  const data = body?.data ?? body ?? {};

  const normalized: DashboardOverview = {
    total_students: data.total_students ?? 0,
    total_violations: data.total_violations ?? 0,
    total_pending_reports: data.total_pending_reports ?? 0,
    total_classes: data.total_classes ?? 0,
  };

  return normalized;
}
