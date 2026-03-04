import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectReport } from "@/lib/apis/reports";

export function useRejectReportMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectReport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reports"] });
    },
  });
}
