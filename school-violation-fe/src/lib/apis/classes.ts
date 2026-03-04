import api from "@/lib/http";
import type { ClassOption } from "@/app/(admin)/admin/students/helper";

export async function fetchClasses() {
  const res = await api.get("/admin/classes");
  const body = res.data;

  const list =
    Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];

  return list as ClassOption[];
}

export interface CreateClassPayload {
  name: string;
  year?: string;
  homeroom?: string;
}

export async function createClass(payload: CreateClassPayload) {
  const res = await api.post("/admin/classes", payload);
  return res.data;
}
