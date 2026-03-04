import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createViolationType } from "@/lib/apis/violation-types";
import type { CreateViolationTypePayload } from "@/app/(admin)/admin/violation-types/helper";

export function useCreateViolationTypeMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateViolationTypePayload) =>
      createViolationType(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["violation-types"] });
    },
  });
}
