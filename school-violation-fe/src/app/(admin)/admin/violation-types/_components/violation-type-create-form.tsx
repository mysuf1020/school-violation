"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text, Input, Button } from "@/components/ui";
import {
  CreateViolationTypePayload,
  VIOLATION_CATEGORIES,
} from "../helper";
import { useCreateViolationTypeMutation } from "@/lib/hooks/mutations/use-create-violation-type";

export function ViolationTypeCreateForm() {
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const mutation = useCreateViolationTypeMutation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!code || !category || !description || !point) {
      setErrorMsg("Semua field wajib diisi.");
      return;
    }

    const parsedPoint = Number(point);
    if (Number.isNaN(parsedPoint) || parsedPoint <= 0) {
      setErrorMsg("Point harus berupa angka lebih dari 0.");
      return;
    }

    const payload: CreateViolationTypePayload = {
      code: code.trim().toUpperCase(),
      category: category.trim().toUpperCase(),
      description: description.trim(),
      point: parsedPoint,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMsg("Jenis pelanggaran berhasil ditambahkan.");
        setCode("");
        setCategory("");
        setDescription("");
        setPoint("");
      },
      onError: () => {
        setErrorMsg("Gagal menambahkan jenis pelanggaran.");
      },
    });
  }

  return (
    <Card className="p-4 mb-4">
      <Flex direction="col" gap="4">
        <Text level="m" strong>
          Tambah Jenis Pelanggaran
        </Text>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Flex direction="col" gap="1">
            <Text level="s">Kode</Text>
            <Input
              placeholder="Misal: B01"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Kategori</Text>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Pilih kategori</option>
              {VIOLATION_CATEGORIES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Deskripsi</Text>
            <Input
              placeholder="Contoh: Merokok di lingkungan sekolah"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Point</Text>
            <Input
              type="number"
              placeholder="Misal: 10"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
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
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </Flex>
    </Card>
  );
}
