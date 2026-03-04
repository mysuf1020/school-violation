import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent } from "@/lib/apis/students";
import type { CreateStudentPayload } from "@/app/(admin)/admin/students/helper";

export function useCreateStudentMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentPayload) => createStudent(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
