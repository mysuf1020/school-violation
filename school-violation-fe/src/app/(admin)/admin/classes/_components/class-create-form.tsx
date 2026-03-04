"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text, Input, Button } from "@/components/ui";
import { useCreateClassMutation } from "@/lib/hooks/mutations/use-create-class";
import type { CreateClassPayload } from "@/lib/apis/classes";

export function ClassCreateForm() {
    const createMutation = useCreateClassMutation();

    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [homeroom, setHomeroom] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!name) {
            setErrorMsg("Nama kelas wajib diisi.");
            return;
        }

        const payload: CreateClassPayload = {
            name,
            year: year || undefined,
            homeroom: homeroom || undefined,
        };

        createMutation.mutate(payload, {
            onSuccess: () => {
                setSuccessMsg("Kelas berhasil ditambahkan.");
                setName("");
                setYear("");
                setHomeroom("");
            },
            onError: () => {
                setErrorMsg("Gagal menambahkan kelas. Periksa data yang diinput.");
            },
        });
    }

    return (
        <Card className="p-4 mb-4">
            <Flex direction="col" gap="4">
                <Text level="m" strong>
                    Tambah Kelas
                </Text>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <Flex direction="col" gap="1">
                        <Text level="s">Nama Kelas *</Text>
                        <Input
                            placeholder="Contoh: X RPL 1"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Flex>

                    <Flex direction="col" gap="1">
                        <Text level="s">Tahun Ajaran</Text>
                        <Input
                            placeholder="Contoh: 2025/2026"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </Flex>

                    <Flex direction="col" gap="1">
                        <Text level="s">Wali Kelas</Text>
                        <Input
                            placeholder="Nama Lengkap Wali Kelas"
                            value={homeroom}
                            onChange={(e) => setHomeroom(e.target.value)}
                        />
                    </Flex>

                    {errorMsg && (
                        <Text level="s" className="text-red-500">
                            {errorMsg}
                        </Text>
                    )}
                    {successMsg && (
                        <Text level="s" className="text-emerald-600">
                            {successMsg}
                        </Text>
                    )}

                    <Button
                        type="submit"
                        className="mt-2"
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                </form>
            </Flex>
        </Card>
    );
}
