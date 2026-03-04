"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Scale,
  ScrollText,
  FileWarning,
} from "lucide-react";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Siswa", icon: Users },
  { href: "/admin/violations", label: "Pelanggaran", icon: ShieldCheck },
  { href: "/admin/violation-types", label: "Jenis Pelanggaran", icon: ScrollText },
  { href: "/admin/sanction-rules", label: "Aturan Sanksi", icon: Scale },
  { href: "/admin/reports", label: "Laporan Publik", icon: FileWarning },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-slate-950/95 px-6 py-8 text-white">
      <div className="space-y-1">
        <Text level="xl" strong className="text-white">
          SchoolViolation
        </Text>
        <p className="text-sm text-white/60">
          SMKN 5 Kabupaten Tangerang
        </p>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {LINKS.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-white text-slate-900 shadow-xl shadow-slate-900/30"
                  : "text-white/80 hover:bg-white/10",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition",
                  active && "bg-slate-900/5 text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        <p className="font-semibold text-white">Perlu lapor cepat?</p>
        <p className="mt-1">
          Form publik tersedia untuk warga sekolah. Arahkan mereka ke kanal resmi.
        </p>
        <Link
          href="/report"
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-white/40 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
        >
          Buka Form Publik
        </Link>
      </div>
    </aside>
  );
}
