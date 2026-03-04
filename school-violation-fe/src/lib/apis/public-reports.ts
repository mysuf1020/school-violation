import api from "@/lib/http";

export async function createPublicReport(payload: FormData) {
  const res = await api.post("/public/reports", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchPublicReportStatus(code: string) {
  const res = await api.get(`/public/reports/${code}`);
  return res.data;
}
