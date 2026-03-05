"use client";

import { useStudentsQuery } from "@/lib/hooks/queries/use-students-query";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text } from "@/components/ui";
import type { StudentItem } from "../helper";

export function StudentTable() {
  const { data, isLoading, error } = useStudentsQuery();
  const students: StudentItem[] = Array.isArray(data) ? data : [];

  const errMsg =
    error instanceof Error
      ? error.message
      : error
        ? "Gagal memuat data siswa."
        : "";

  return (
    <Card className="p-4">
      <Flex direction="col" gap="3">
        <Flex justifyContent="between" alignItems="center">
          <Text level="m" strong>
            Daftar Siswa
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
                  NIS
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Nama
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Jenis Kelamin
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Kelas
                </th>
                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                  Poin
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && !isLoading && !errMsg && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-4 text-center text-slate-400 text-sm"
                  >
                    Belum ada data siswa.
                  </td>
                </tr>
              )}

              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 border-b border-slate-100">
                    {s.nis}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {s.name}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {s.gender === "L"
                      ? "Laki-laki"
                      : s.gender === "P"
                        ? "Perempuan"
                        : s.gender || "-"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {s.class_name ?? "-"}
                  </td>
                  <td className="px-3 py-2 border-b border-slate-100">
                    {s.total_point ?? 0}
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
