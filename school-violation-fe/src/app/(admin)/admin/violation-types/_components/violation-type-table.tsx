"use client";

import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text } from "@/components/ui";
import { useViolationTypesQuery } from "@/lib/hooks/queries/use-violation-types-query";
import type { ViolationTypeItem } from "../helper";

export function ViolationTypeTable() {
  const { data, isLoading, error } = useViolationTypesQuery();
  const items: ViolationTypeItem[] = Array.isArray(data) ? data : [];

  const errMsg =
    error instanceof Error
      ? error.message
      : error
      ? "Gagal memuat jenis pelanggaran."
      : "";

  return (
    <Card className="p-4">
      <Flex direction="col" gap="3">
        <Flex justifyContent="between" alignItems="center">
          <Text level="m" strong>
            Daftar Jenis Pelanggaran
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
                  Kode
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Kategori
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Deskripsi
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Point
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !isLoading && !errMsg && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400 text-sm"
                  >
                    Belum ada data jenis pelanggaran.
                  </td>
                </tr>
              )}

              {items.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.code}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.category}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.description}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.point}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {v.is_active ? "Aktif" : "Non-aktif"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Flex>
    </Card>
  );
}
