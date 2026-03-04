"use client";

import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text } from "@/components/ui";
import { useSanctionRulesQuery } from "@/lib/hooks/queries/use-sanction-rules-query";
import type { SanctionRuleItem } from "../helper";

export function SanctionRuleTable() {
  const { data, isLoading, error } = useSanctionRulesQuery();
  const items: SanctionRuleItem[] = Array.isArray(data) ? data : [];

  const errMsg =
    error instanceof Error
      ? error.message
      : error
      ? "Gagal memuat aturan sanksi."
      : "";

  return (
    <Card className="p-4">
      <Flex direction="col" gap="3">
        <Flex justifyContent="between" alignItems="center">
          <Text level="m" strong>
            Daftar Aturan Sanksi
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
                  Min Point
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Max Point
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Nama Sanksi
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Deskripsi
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !isLoading && !errMsg && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-slate-400 text-sm"
                  >
                    Belum ada aturan sanksi.
                  </td>
                </tr>
              )}

              {items.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 border-b border-slate-100">
                    {r.min_point}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {r.max_point}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {r.name}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {r.description || "-"}
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
