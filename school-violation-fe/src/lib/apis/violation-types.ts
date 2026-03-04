import api from "@/lib/http";
import type {
  CreateViolationTypePayload,
  ViolationTypeItem,
} from "@/app/(admin)/admin/violation-types/helper";

export async function fetchViolationTypes() {
  const res = await api.get("/public/violation-types");
  const body = res.data;

  const list =
    Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];

  return list as ViolationTypeItem[];
}

export async function createViolationType(payload: CreateViolationTypePayload) {
  const res = await api.post("/admin/violation-types", payload);
  return res.data;
}
