"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const toneStyles = {
  sky: "bg-sky-100 text-sky-600",
  amber: "bg-amber-100 text-amber-600",
  emerald: "bg-emerald-100 text-emerald-600",
  indigo: "bg-indigo-100 text-indigo-600",
};

type Props = {
  label: string;
  value: number;
  loading?: boolean;
  icon: LucideIcon;
  helper?: string;
  tone?: keyof typeof toneStyles;
};

export function DashboardStat({
  label,
  value,
  loading,
  icon: Icon,
  helper,
  tone = "sky",
}: Props) {
  const formattedValue = new Intl.NumberFormat("id-ID").format(value);

  return (
    <Card className="w-full border-0 bg-white/95 p-5 shadow-lg shadow-slate-900/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-3 h-8 w-24 rounded-md" />
          ) : (
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {formattedValue}
            </p>
          )}
        </div>
        <span
          className={cn(
            "rounded-2xl p-3 text-base",
            toneStyles[tone] ?? toneStyles.sky,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {helper && (
        <p className="mt-4 text-sm text-slate-500">
          {helper}
        </p>
      )}
    </Card>
  );
}
