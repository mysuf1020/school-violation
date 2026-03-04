"use client";

import { useClassesQuery } from "@/lib/hooks/queries/use-classes-query";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text } from "@/components/ui";
import type { ClassOption } from "@/app/(admin)/admin/students/helper";

export function ClassTable() {
    const { data, isLoading, error } = useClassesQuery();
    const classes: ClassOption[] = Array.isArray(data) ? data : [];

    const errMsg =
        error instanceof Error
            ? error.message
            : error
                ? "Gagal memuat data kelas."
                : "";

    return (
        <Card className="p-4">
            <Flex direction="col" gap="3">
                <Flex justifyContent="between" alignItems="center">
                    <Text level="m" strong>
                        Daftar Kelas
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
                                    Nama Kelas
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                                    Tahun Ajaran
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-slate-500 border-b">
                                    Wali Kelas
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.length === 0 && !isLoading && !errMsg && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-3 py-4 text-center text-slate-400 text-sm"
                                    >
                                        Belum ada data kelas.
                                    </td>
                                </tr>
                            )}

                            {classes.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 border-b border-slate-100">
                                        {c.name}
                                    </td>
                                    <td className="px-3 py-2 border-b border-slate-100">
                                        {c.year || "-"}
                                    </td>
                                    <td className="px-3 py-2 border-b border-slate-100">
                                        {c.homeroom || "-"}
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
