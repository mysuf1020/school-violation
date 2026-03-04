"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text, Button } from "@/components/ui";

import { useViolationsQuery } from "@/lib/hooks/queries/use-violations-query";
import type { ViolationItem } from "../helper";

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

export function ViolationTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useViolationsQuery({
    page,
    limit: DEFAULT_LIMIT,
  });

  const items: ViolationItem[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? DEFAULT_LIMIT;
  const currentPage = data?.page ?? page;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  const errMsg =
    error instanceof Error
      ? error.message
      : error
      ? "Gagal memuat data pelanggaran."
      : "";

  function handlePrev() {
    if (currentPage > 1) setPage(currentPage - 1);
  }

  function handleNext() {
    if (currentPage < totalPages) setPage(currentPage + 1);
  }

  return (
    <Card className="p-4">
      <Flex direction="col" gap="3">
        <Flex justifyContent="between" alignItems="center">
          <Text level="m" strong>
            Daftar Pelanggaran
          </Text>

          {isLoading && (
            <Text level="s" className="text-slate-400">
              Memuat...
            </Text>
          )}
        </Flex>

        {errMsg && (
          <Text level="s" className="text-red-500">
            {errMsg}
          </Text>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-t border-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Tanggal
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Siswa
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Kelas
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Kode
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Jenis
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Poin
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Total Poin Setelah
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Sanksi
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Sumber
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !isLoading && !errMsg && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-4 text-center text-slate-400 text-sm"
                  >
                    Belum ada data pelanggaran.
                  </td>
                </tr>
              )}

              {items.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 border-b border-slate-100">
                    {formatDate(v.occurred_at)}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.student_name}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.class_name}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.violation_code}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.violation_category}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.violation_point}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.total_point_after}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.sanction_name_after || "-"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Flex
          justifyContent="between"
          alignItems="center"
          className="mt-3"
        >
          <Text level="s" className="text-slate-500">
            Halaman {currentPage} dari {totalPages} • Total {total} pelanggaran
          </Text>

          <Flex gap="2">
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
