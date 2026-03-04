import api from "@/lib/http";
import type {
  CreateSanctionRulePayload,
  SanctionRuleItem,
} from "@/app/(admin)/admin/sanction-rules/helper";

export async function fetchSanctionRules() {
  const res = await api.get("/admin/sanction-rules");
  const body = res.data;

  const list =
    Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];

  return list as SanctionRuleItem[];
}

export async function createSanctionRule(payload: CreateSanctionRulePayload) {
  const res = await api.post("/admin/sanction-rules", payload);
  return res.data;
}
