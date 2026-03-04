import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveReport } from "@/lib/apis/reports";

export function useApproveReportMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveReport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reports"] });
    },
  });
}
