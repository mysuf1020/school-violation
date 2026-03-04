import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "@/lib/apis/students";

export function useStudentsQuery() {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    staleTime: 1000 * 30,
  });
}
