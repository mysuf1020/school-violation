"use client";

import { useState, FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/layout/flex";
import { Text, Input, Button } from "@/components/ui";

import { useStudentsQuery } from "@/lib/hooks/queries/use-students-query";
import { useViolationTypesQuery } from "@/lib/hooks/queries/use-violation-types-query";
import { useCreateViolationMutation } from "@/lib/hooks/mutations/use-create-violation";
import type {
  CreateViolationPayload,
  ViolationSource,
} from "../helper";
import type { StudentItem } from "@/app/(admin)/admin/students/helper";
import type { ViolationTypeItem } from "@/app/(admin)/admin/violation-types/helper";

const SOURCES: { value: ViolationSource; label: string }[] = [
  { value: "DIRECT", label: "Input Langsung" },
  { value: "REPORT", label: "Dari Laporan Publik" },
  { value: "OTHER", label: "Lainnya" },
];

export function ViolationCreateForm() {
  const { data: students = [] } = useStudentsQuery();
  const { data: violationTypes = [] } = useViolationTypesQuery();

  const mutation = useCreateViolationMutation();

  const [studentId, setStudentId] = useState("");
  const [violationTypeId, setViolationTypeId] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<ViolationSource | "">("DIRECT");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!studentId || !violationTypeId) {
      setErrorMsg("Siswa dan jenis pelanggaran wajib dipilih.");
      return;
    }

    const payload: CreateViolationPayload = {
      student_id: studentId,
      violation_type_id: violationTypeId,
      location: location || undefined,
      description: description || undefined,
      source: source || undefined, // kalau kosong, BE default DIRECT
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMsg("Pelanggaran berhasil dicatat.");
        setStudentId("");
        setViolationTypeId("");
        setLocation("");
        setDescription("");
        setSource("DIRECT");
      },
      onError: () => {
        setErrorMsg("Gagal mencatat pelanggaran. Periksa data yang diinput.");
      },
    });
  }

  return (
    <Card className="p-4 mb-4">
      <Flex direction="col" gap="4">
        <Text level="m" strong>
          Input Pelanggaran Siswa
        </Text>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Siswa */}
          <Flex direction="col" gap="1">
            <Text level="s">Siswa</Text>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">Pilih siswa</option>
              {students.map((s: StudentItem) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.class_name ? `- ${s.class_name}` : ""}
                </option>
              ))}
            </select>
          </Flex>

          {/* Jenis Pelanggaran */}
          <Flex direction="col" gap="1">
            <Text level="s">Jenis Pelanggaran</Text>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={violationTypeId}
              onChange={(e) => setViolationTypeId(e.target.value)}
            >
              <option value="">Pilih jenis pelanggaran</option>
              {violationTypes.map((vt: ViolationTypeItem) => (
                <option key={vt.id} value={vt.id}>
                  [{vt.code}] {vt.description} ({vt.point} poin)
                </option>
              ))}
            </select>
          </Flex>

          {/* Lokasi */}
          <Flex direction="col" gap="1">
            <Text level="s">Lokasi</Text>
            <Input
              placeholder="Contoh: Lapangan, kelas X IPA 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Flex>

          {/* Deskripsi */}
          <Flex direction="col" gap="1">
            <Text level="s">Deskripsi</Text>
            <Input
              placeholder="Detail kejadian (opsional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Flex>

          {/* Sumber */}
          <Flex direction="col" gap="1">
            <Text level="s">Sumber</Text>
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={source}
              onChange={(e) => setSource(e.target.value as ViolationSource)}
            >
              {SOURCES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </Flex>
    </Card>
  );
}
