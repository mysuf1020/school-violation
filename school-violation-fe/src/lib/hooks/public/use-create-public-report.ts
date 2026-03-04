import { useMutation } from "@tanstack/react-query";
import { createPublicReport } from "@/lib/apis/public-reports";

export function useCreatePublicReportMutation() {
  return useMutation({
    mutationFn: (payload: FormData) => createPublicReport(payload),
  });
}
