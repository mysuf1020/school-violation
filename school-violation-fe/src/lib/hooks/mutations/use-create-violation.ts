import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createViolation } from "@/lib/apis/violations";
import type { CreateViolationPayload } from "@/app/(admin)/admin/violations/helper";

export function useCreateViolationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateViolationPayload) => createViolation(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["violations"] });
    },
  });
}
