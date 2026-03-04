import api from "@/lib/http";
import type {
  PaginatedReports,
  ReportListParams,
} from "@/app/(admin)/admin/reports/helper";

export async function fetchAdminReports(params: ReportListParams) {
  type QueryValue = string | number | boolean | undefined;
  const query: Record<string, QueryValue> = {};

  if (params.page != null) query.page = params.page;
  if (params.limit != null) query.limit = params.limit;
  if (params.search) query.search = params.search;
  if (params.status && params.status !== "ALL") query.status = params.status;
  if (params.sort) query.sort = params.sort;

  const res = await api.get("/admin/reports", { params: query });
  const body = res.data;

  const data = body?.data ?? body ?? {};

  const normalized: PaginatedReports = {
    items: Array.isArray(data.items) ? data.items : [],
    page: data.page ?? query.page ?? 1,
    limit: data.limit ?? query.limit ?? 20,
    total: data.total ?? 0,
  };

  return normalized;
}

export async function approveReport(id: string) {
  const res = await api.patch(`/admin/reports/${id}/approve`);
  return res.data;
}

export async function rejectReport(id: string) {
  const res = await api.patch(`/admin/reports/${id}/reject`);
  return res.data;
}
