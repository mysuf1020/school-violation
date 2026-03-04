import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass, type CreateClassPayload } from "@/lib/apis/classes";

export function useCreateClassMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateClassPayload) => createClass(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["classes"] });
        },
    });
}
