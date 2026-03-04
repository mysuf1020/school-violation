"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Input, Button } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useViolationTypesQuery } from "@/lib/hooks/queries/use-violation-types-query";
import { useCreatePublicReportMutation } from "@/lib/hooks/public/use-create-public-report";
import type { ViolationTypeItem } from "@/app/(admin)/admin/violation-types/helper";

const reportHighlights = [
  {
    title: "Identitas Dirahasiakan",
    description:
      "Informasi pelapor tidak dibagikan ke pihak lain kecuali tim kesiswaan.",
  },
  {
    title: "Penanganan Terstruktur",
    description:
      "Setiap laporan masuk ke sistem back-office dan ditangani sesuai SOP.",
  },
  {
    title: "Pantau dengan Kode",
    description:
      "Setiap laporan memiliki kode unik untuk mengecek perkembangan laporan.",
  },
];

export default function PublicReportPage() {
  const router = useRouter();
  const { data: types = [] } = useViolationTypesQuery();
  const mutation = useCreatePublicReportMutation();

  const [reportedName, setReportedName] = useState("");
  const [reportedClass, setReportedClass] = useState("");
  const [violationTypeId, setViolationTypeId] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const evidenceInputRef = useRef<HTMLInputElement | null>(null);

  const [successCode, setSuccessCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessCode("");

    if (!reportedName || !reportedClass || !violationTypeId) {
      setErrorMsg("Nama siswa, kelas, dan jenis pelanggaran wajib diisi.");
      return;
    }

    const form = new FormData();
    form.append("reported_name", reportedName);
    form.append("reported_class", reportedClass);
    form.append("violation_type_id", violationTypeId);
    if (occurredAt) {
      const parsed = new Date(occurredAt);
      if (!Number.isNaN(parsed.getTime())) {
        form.append("occurred_at", parsed.toISOString());
      }
    }
    form.append("location", location);
    form.append("description", description);
    if (reporterName) form.append("reporter_name", reporterName);
    if (evidence) form.append("evidence", evidence);

    mutation.mutate(form, {
      onSuccess: (res: { data?: { code?: string }; code?: string }) => {
        const code = res?.data?.code ?? res?.code ?? "";
        if (!code) {
          setErrorMsg(
            "Laporan terkirim, tetapi kode tidak ditemukan di response."
          );
          return;
        }

        setSuccessCode(code);
      },
      onError: () => {
        setErrorMsg("Gagal mengirim laporan.");
      },
    });
  }

  const isSubmitting = mutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] md:block"
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
            Layanan Publik
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Laporan Pelanggaran Peserta Didik
            </h1>
            <p className="text-sm text-sky-100 sm:text-base">
              Sampaikan kejadian yang Anda lihat agar tim kesiswaan dapat
              melakukan pembinaan sesuai tata tertib. Data pelapor kami
              lindungi sepenuhnya.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm text-sky-100 backdrop-blur">
              Isi formulir, unggah bukti pendukung, dan simpan kode tracking
              untuk memantau laporan.
            </div>
            <Button
              variant="secondary"
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 sm:w-auto"
              onClick={() => router.push("/report/status")}
            >
              Cek Status Laporan
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-10 flex w-full max-w-4xl flex-col gap-8 px-6 pb-16 sm:px-8">
        <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-3">
          {reportHighlights.map((item) => (
            <div key={item.title} className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                {item.title}
              </p>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4 text-white sm:px-8">
            <p className="text-sm font-semibold">
              Lengkapi data berikut untuk membantu tim kami menindaklanjuti
              laporan.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Nama Siswa *
                </label>
                <Input
                  value={reportedName}
                  onChange={(e) => setReportedName(e.target.value)}
                  placeholder="Nama siswa yang dilaporkan"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Kelas / Kompetensi *
                </label>
                <Input
                  value={reportedClass}
                  onChange={(e) => setReportedClass(e.target.value)}
                  placeholder="Contoh: XI RPL 2"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Jenis Pelanggaran *
              </label>
              <Select
                value={violationTypeId}
                onValueChange={(val) => setViolationTypeId(val)}
              >
                <SelectTrigger className="h-auto min-h-11 rounded-xl border border-slate-200 px-4 py-2 text-left text-sm text-slate-700">
                  <SelectValue placeholder="Pilih jenis pelanggaran…" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="max-h-72 w-[var(--radix-select-trigger-width)]"
                >
                  {types.map((t: ViolationTypeItem) => (
                    <SelectItem key={t.id} value={t.id}>
                      <span className="font-semibold">{t.code}</span>{" "}
                      <span className="text-slate-700">{t.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Tanggal Kejadian
                </label>
                <Input
                  type="datetime-local"
                  value={occurredAt}
                  onChange={(e) => setOccurredAt(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Lokasi Kejadian
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Kelas, workshop, halaman, dll."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Nama Pelapor (opsional)
              </label>
              <Input
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Boleh dikosongkan"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Deskripsi Kejadian
              </label>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kronologi kejadian secara singkat."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Bukti Foto (opsional)
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  ref={evidenceInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => evidenceInputRef.current?.click()}
                >
                  Pilih file
                </Button>
                <span className="text-sm text-slate-600">
                  {evidence?.name ?? "Tidak ada file yang dipilih"}
                </span>
              </div>
            </div>

            {errorMsg && (
              <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {errorMsg}
              </p>
            )}

            {successCode && (
              <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
                <p>
                  Laporan berhasil dikirim! Simpan kode berikut untuk memantau
                  progres: <strong>{successCode}</strong>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => router.push(`/report/status/${successCode}`)}
                >
                  Lihat Status Laporan Ini
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-2xl py-3 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
