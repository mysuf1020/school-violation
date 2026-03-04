"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text, Input, Button } from "@/components/ui";
import { useClassesQuery } from "@/lib/hooks/queries/use-classes-query";
import { useCreateStudentMutation } from "@/lib/hooks/mutations/use-create-student";
import type { ClassOption, CreateStudentPayload } from "../helper";

export function StudentCreateForm() {
  const { data: classes = [], isLoading: loadingClasses } = useClassesQuery();
  const createMutation = useCreateStudentMutation();

  const [nis, setNis] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"L" | "P" | "">("");
  const [classId, setClassId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nis || !name || !gender || !classId) {
      setErrorMsg("Semua field wajib diisi.");
      return;
    }

    const payload: CreateStudentPayload = {
      nis,
      name,
      gender,
      class_id: classId,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMsg("Siswa berhasil ditambahkan.");
        setNis("");
        setName("");
        setGender("");
        setClassId("");
      },
      onError: () => {
        setErrorMsg("Gagal menambahkan siswa. Periksa data yang diinput.");
      },
    });
  }

  return (
    <Card className="p-4 mb-4">
      <Flex direction="col" gap="4">
        <Text level="m" strong>
          Tambah Siswa
        </Text>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Flex direction="col" gap="1">
            <Text level="s">NIS</Text>
            <Input
              placeholder="Nomor Induk Siswa"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
            />
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Nama Siswa</Text>
            <Input
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Jenis Kelamin</Text>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={gender}
              onChange={(e) => setGender(e.target.value as "L" | "P" | "")}
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Kelas</Text>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={loadingClasses}
            >
              <option value="">
                {loadingClasses ? "Memuat data kelas..." : "Pilih kelas"}
              </option>
              {classes.map((c: ClassOption) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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
