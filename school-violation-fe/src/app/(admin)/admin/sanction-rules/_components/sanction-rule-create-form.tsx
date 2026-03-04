"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text, Input, Button } from "@/components/ui";
import type { CreateSanctionRulePayload } from "../helper";
import { useCreateSanctionRuleMutation } from "@/lib/hooks/mutations/use-create-sanction-rule";

export function SanctionRuleCreateForm() {
  const [minPoint, setMinPoint] = useState("");
  const [maxPoint, setMaxPoint] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const mutation = useCreateSanctionRuleMutation();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!maxPoint || !name) {
      setErrorMsg("Minimal isi Max Point dan Nama Sanksi.");
      return;
    }

    const min = minPoint ? Number(minPoint) : 0;
    const max = Number(maxPoint);

    if (Number.isNaN(min) || Number.isNaN(max) || max <= 0) {
      setErrorMsg("Point harus berupa angka, dan max_point > 0.");
      return;
    }

    if (min > max) {
      setErrorMsg("Min point tidak boleh lebih besar dari max point.");
      return;
    }

    const payload: CreateSanctionRulePayload = {
      min_point: min,
      max_point: max,
      name: name.trim(),
      description: description.trim(),
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMsg("Aturan sanksi berhasil ditambahkan.");
        setMinPoint("");
        setMaxPoint("");
        setName("");
        setDescription("");
      },
      onError: () => {
        setErrorMsg("Gagal menambahkan aturan sanksi.");
      },
    });
  }

  return (
    <Card className="p-4 mb-4">
      <Flex direction="col" gap="4">
        <Text level="m" strong>
          Tambah Aturan Sanksi
        </Text>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Flex direction="col" gap="1">
            <Text level="s">Min Point</Text>
            <Input
              type="number"
              placeholder="0 (boleh kosong)"
              value={minPoint}
              onChange={(e) => setMinPoint(e.target.value)}
            />
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Max Point</Text>
            <Input
              type="number"
              placeholder="Wajib diisi, contoh: 20"
              value={maxPoint}
              onChange={(e) => setMaxPoint(e.target.value)}
            />
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Nama Sanksi</Text>
            <Input
              placeholder="Contoh: Teguran lisan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Flex>

          <Flex direction="col" gap="1">
            <Text level="s">Deskripsi</Text>
            <Input
              placeholder="Opsional, contoh: Dipanggil orang tua."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
