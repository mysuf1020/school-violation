import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSanctionRule } from "@/lib/apis/sanction-rules";
import type { CreateSanctionRulePayload } from "@/app/(admin)/admin/sanction-rules/helper";

export function useCreateSanctionRuleMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSanctionRulePayload) =>
      createSanctionRule(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sanction-rules"] });
    },
  });
}
