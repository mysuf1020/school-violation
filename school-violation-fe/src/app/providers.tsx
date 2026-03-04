"use client";
import "@/lib/polyfill-local-storage";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfirmationDialogProvider } from "@/lib/hooks/use-confirmation-dialog";
import { Toaster } from "@/components/ui";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ConfirmationDialogProvider>{children}</ConfirmationDialogProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
