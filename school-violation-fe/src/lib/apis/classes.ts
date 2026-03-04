import api from "@/lib/http";
import type { ClassOption } from "@/app/(admin)/admin/students/helper";

export async function fetchClasses() {
  const res = await api.get("/admin/classes");
  const body = res.data;

  const list =
    Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];

  return list as ClassOption[];
}
