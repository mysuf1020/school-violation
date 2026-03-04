"use client";

import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text, Button, Input } from "@/components/ui";

import { useAdminReportsQuery } from "@/lib/hooks/queries/use-admin-reports-query";
import { useApproveReportMutation } from "@/lib/hooks/mutations/use-approve-report";
import { useRejectReportMutation } from "@/lib/hooks/mutations/use-reject-report";
import { cn } from "@/lib/utils";

import type { ReportAdminItem, ReportStatus } from "../helper";

const DEFAULT_LIMIT = 10;

function formatDate(value: string | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const tone = useMemo(() => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  }, [status]);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone
      )}
    >
      {status}
    </span>
  );
}

export function ReportTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortOrder]);

  const { data, isLoading, error } = useAdminReportsQuery({
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch,
    status: statusFilter,
    sort: sortOrder,
  });

  const approveMutation = useApproveReportMutation();
  const rejectMutation = useRejectReportMutation();

  const items: ReportAdminItem[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? DEFAULT_LIMIT;
  const currentPage = data?.page ?? page;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  const errMsg =
    error instanceof Error
      ? error.message
      : error
      ? "Gagal memuat laporan publik."
      : "";

  function handlePrev() {
    if (currentPage > 1) setPage(currentPage - 1);
  }

  function handleNext() {
    if (currentPage < totalPages) setPage(currentPage + 1);
  }

  function handleApprove(id: string) {
    approveMutation.mutate(id);
  }

  function handleReject(id: string) {
    rejectMutation.mutate(id);
  }

  return (
    <Card className="mx-auto w-full max-w-5xl border-0 bg-white/95 p-4 shadow-lg shadow-slate-900/5 sm:p-6">
      <Flex direction="col" gap="5">
        <div className="flex flex-col gap-4">
          <Flex
            justifyContent="between"
            alignItems="center"
            className="flex-col gap-2 text-center sm:flex-row sm:text-left"
          >
            <Text level="m" strong>
              Laporan Publik
            </Text>
            {isLoading && (
              <Text level="s" className="text-slate-400">
                Memuat...
              </Text>
            )}
          </Flex>

          <div className="grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Cari nama siswa / kode laporan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "ALL")}
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Terbaru ke Lama</option>
              <option value="asc">Lama ke Terbaru</option>
            </select>
          </div>
        </div>

        {errMsg && (
          <Text level="s" className="text-red-500">
            {errMsg}
          </Text>
        )}

        <div className="hidden md:block">
          <div className="max-h-[520px] min-w-full overflow-y-auto overflow-x-auto rounded-2xl border border-slate-100">
            <table className="min-w-[900px] table-auto text-sm">
            <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">
                      Kode
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">
                      Siswa Dilaporkan
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">
                      Kelas
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left font-semibold text-slate-500">
                      Lokasi
                    </th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left font-semibold text-slate-500">
                      Deskripsi
                    </th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left font-semibold text-slate-500">
                      Pelapor
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-500">
                      Status
                    </th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left font-semibold text-slate-500">
                      Ditangani Oleh
                    </th>
                    <th className="sticky right-0 min-w-[8rem] border-l border-slate-200 bg-slate-100 px-3 py-3 text-center font-semibold text-slate-600 shadow-[inset_8px_0_10px_-8px_rgba(0,0,0,0.15)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && !isLoading && !errMsg && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-6 text-center text-sm text-slate-400"
                      >
                        Belum ada laporan publik.
                      </td>
                    </tr>
                  )}

              {items.map((r) => {
                const isPending = r.status === "PENDING";
                const isApproving =
                  approveMutation.isPending &&
                  approveMutation.variables === r.id;
                const isRejecting =
                  rejectMutation.isPending &&
                  rejectMutation.variables === r.id;

                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 border-b border-slate-100">
                      {formatDate(r.created_at)}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 align-top">
                      {r.code}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 align-top break-words">
                      {r.reported_name}
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100">
                      {r.reported_class}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 border-b border-slate-100 align-top break-words">
                      {r.location}
                    </td>
                    <td className="hidden xl:table-cell px-4 py-3 border-b border-slate-100 align-top whitespace-pre-wrap break-words">
                      {r.description || "-"}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-3 border-b border-slate-100 align-top break-words">
                      {r.reporter_name || "-"}
                    </td>
                    <td className="px-3 py-2 border-b border-slate-100 align-top">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="hidden xl:table-cell px-4 py-3 border-b border-slate-100 align-top break-words">
                      {r.handled_by_name ?? "-"}
                    </td>
                    <td className="sticky right-0 border-b border-l border-slate-200 bg-white px-3 py-3 shadow-[inset_8px_0_10px_-8px_rgba(0,0,0,0.08)]">
                      <Flex gap="2" className="flex-wrap items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(r.id)}
                          disabled={!isPending || isApproving || isRejecting}
                        >
                          {isApproving ? "..." : "Approve"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(r.id)}
                          disabled={!isPending || isApproving || isRejecting}
                        >
                          {isRejecting ? "..." : "Reject"}
                        </Button>
                      </Flex>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            </table>
          </div>
        </div>
        <div className="grid gap-4 md:hidden">
          {items.map((r) => {
            const isPending = r.status === "PENDING";
            const isApproving =
              approveMutation.isPending && approveMutation.variables === r.id;
            const isRejecting =
              rejectMutation.isPending && rejectMutation.variables === r.id;

            return (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-100 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {r.reported_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {r.reported_class}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Tanggal
                    </dt>
                    <dd>{formatDate(r.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Kode
                    </dt>
                    <dd>{r.code}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Lokasi
                    </dt>
                    <dd>{r.location}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Deskripsi
                    </dt>
                    <dd className="text-slate-700">{r.description}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Pelapor
                    </dt>
                    <dd>{r.reporter_name || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Ditangani
                    </dt>
                    <dd>{r.handled_by_name ?? "-"}</dd>
                  </div>
                </dl>
                {isPending && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApprove(r.id)}
                      disabled={isApproving || isRejecting}
                    >
                      {isApproving ? "Memproses..." : "Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleReject(r.id)}
                      disabled={isApproving || isRejecting}
                    >
                      {isRejecting ? "Memproses..." : "Reject"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
          {items.length === 0 && !isLoading && !errMsg && (
            <div className="rounded-2xl border border-slate-100 p-6 text-center text-sm text-slate-500">
              Belum ada laporan publik.
            </div>
          )}
        </div>

        {/* Pagination */}
        <Flex
          justifyContent="between"
          alignItems="center"
          className="mt-3 flex-col gap-3 text-center sm:flex-row sm:text-left"
        >
          <Text level="s" className="text-slate-500">
            Halaman {currentPage} dari {totalPages} • Total {total} laporan
          </Text>

          <Flex gap="2" className="w-full justify-center sm:w-auto sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentPage <= 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
            >
              Selanjutnya
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
