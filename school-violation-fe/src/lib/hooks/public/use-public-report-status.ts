import { useQuery } from "@tanstack/react-query";
import api from "@/lib/http";

// Versi yang dipakai FE (camelCase)
export type PublicReportDetail = {
  code: string;
  reportedName: string;
  reportedClass: string;
  violationType: string;
  occurredAt: string | null;
  updatedAt: string | null;
  location: string | null;
  description: string | null;
  status: string;
  evidenceUrl: string | null;
};

export function usePublicReportStatusQuery(code: string) {
  return useQuery<PublicReportDetail>({
    queryKey: ["public-report-status", code],
    enabled: !!code,
    queryFn: async () => {
      const res = await api.get(`/public/reports/${code}`);

      const raw = res.data?.data ?? res.data;

      const violationTypeObj = raw.violation_type ?? null;
      const mapped: PublicReportDetail = {
        code: raw.code,
        reportedName: raw.reported_name ?? "Tidak diketahui",
        reportedClass: raw.reported_class ?? "Tidak diketahui",
        violationType:
          raw.violation_type_description ??
          violationTypeObj?.description ??
          violationTypeObj?.name ??
          violationTypeObj?.code ??
          "-",
        occurredAt:
          typeof raw.occurred_at === "string" ? raw.occurred_at : null,
        updatedAt:
          typeof raw.updated_at === "string" ? raw.updated_at : null,
        location: raw.location ?? "-",
        description: raw.description ?? "-",
        status: raw.status ?? "UNKNOWN",
        evidenceUrl: raw.evidence_url ?? null,
      };

      return mapped;
    },
  });
}
