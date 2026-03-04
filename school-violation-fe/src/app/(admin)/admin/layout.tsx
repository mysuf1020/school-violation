"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Text } from "@/components/ui";
import { useAuthStore } from "@/lib/auth-store";
import { AdminSidebar } from "./_components/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, username, role, logout } =
    useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  SMKN 5 Kab. Tangerang
                </p>
                <Text level="s" className="text-slate-600">
                  Panel tata tertib & pelanggaran
                </Text>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {username ?? "Administrator"}
                  </p>
                  {role && (
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                      {role}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
