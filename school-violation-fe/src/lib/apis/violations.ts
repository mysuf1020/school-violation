import api from "@/lib/http";
import type {
  CreateViolationPayload,
  PaginatedViolations,
  ViolationListParams,
} from "@/app/(admin)/admin/violations/helper";

export async function fetchViolations(params: ViolationListParams) {
  type QueryValue = string | number | boolean | undefined;
  const query: Record<string, QueryValue> = {};

  if (params.page != null) query.page = params.page;
  if (params.limit != null) query.limit = params.limit;
  if (params.className) query.class_name = params.className;
  if (params.category) query.category = params.category;
  if (params.source) query.source = params.source;
  if (params.startDate) query.start_date = params.startDate;
  if (params.endDate) query.end_date = params.endDate;

  const res = await api.get("/admin/violations", { params: query });
  const body = res.data;

  const data = body?.data ?? body ?? {};

  const normalized: PaginatedViolations = {
    items: Array.isArray(data.items) ? data.items : [],
    page: data.page ?? 1,
    limit: data.limit ?? query.limit ?? 20,
    total: data.total ?? 0,
  };

  return normalized;
}

export async function createViolation(payload: CreateViolationPayload) {
  const res = await api.post("/admin/violations", payload);
  return res.data;
}
