import { useQuery } from "@tanstack/react-query";
import { fetchSanctionRules } from "@/lib/apis/sanction-rules";

export function useSanctionRulesQuery() {
  return useQuery({
    queryKey: ["sanction-rules"],
    queryFn: fetchSanctionRules,
    staleTime: 1000 * 60,
  });
}
