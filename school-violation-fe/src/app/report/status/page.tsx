"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Input } from "@/components/ui";

const statusSteps = [
  {
    title: "Masukkan Kode",
    description:
      "Gunakan kode tracking yang kamu terima setelah mengirim laporan. Kode bersifat unik.",
  },
  {
    title: "Lihat Timeline",
    description:
      "Sistem akan menampilkan kronologi penanganan laporan mulai dari diterima, diverifikasi, sampai selesai.",
  },
  {
    title: "Hubungi Kesiswaan",
    description:
      "Jika butuh klarifikasi tambahan, hubungi wali kelas atau tim kesiswaan sambil membawa kode ini.",
  },
];

export default function ReportStatusFormPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!code.trim()) {
      setErrorMsg("Kode laporan wajib diisi.");
      return;
    }

    router.push(`/report/status/${code.trim()}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] md:block"
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 sm:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
            Langkah Selanjutnya
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Cek Status Laporan Pelanggaran
            </h1>
            <p className="text-sm text-sky-100 sm:text-base">
              Masukkan kode tracking yang kamu dapat setelah mengirim laporan.
              Kamu akan diarahkan ke halaman detail yang berisi perkembangan
              penanganan.
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 sm:w-auto"
            onClick={() => router.push("/report")}
          >
            Kembali ke Form Laporan
          </Button>
        </div>
      </header>

      <main className="mx-auto -mt-10 flex w-full max-w-3xl flex-col gap-8 px-6 pb-16 sm:px-8">
        <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-3">
          {statusSteps.map((step) => (
            <div key={step.title} className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                {step.title}
              </p>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4 text-white sm:px-8">
            <p className="text-sm font-semibold">
              Masukkan kode laporan untuk melihat status terbaru.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 sm:px-8">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Kode Laporan *
              </label>
              <Input
                placeholder="Contoh: RP-ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-2xl"
              />
            </div>

            {errorMsg && (
              <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {errorMsg}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-2xl py-3 text-base font-semibold"
            >
              Lihat Status
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
