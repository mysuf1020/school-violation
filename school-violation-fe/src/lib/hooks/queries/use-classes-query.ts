import { useQuery } from "@tanstack/react-query";
import { fetchClasses } from "@/lib/apis/classes";

export function useClassesQuery() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    staleTime: 1000 * 60,
  });
}
