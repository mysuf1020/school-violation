/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import { usePublicReportStatusQuery } from "@/lib/hooks/public/use-public-report-status";

const statusVisuals: Record<
  string,
  { badge: string; bg: string; label: string; description: string }
> = {
  PENDING: {
    badge: "bg-amber-100 text-amber-800",
    bg: "from-amber-500/90 via-orange-500/80 to-rose-500/80",
    label: "Menunggu Tindak Lanjut",
    description:
      "Laporan sudah diterima dan sedang dijadwalkan untuk ditindaklanjuti oleh tim kesiswaan.",
  },
  APPROVED: {
    badge: "bg-emerald-100 text-emerald-800",
    bg: "from-emerald-500/90 via-teal-500/80 to-sky-500/80",
    label: "Sedang Ditangani",
    description:
      "Pembinaan sedang berjalan dan akan diarsipkan setelah tindakan selesai.",
  },
  REJECTED: {
    badge: "bg-rose-100 text-rose-800",
    bg: "from-rose-500/90 via-orange-500/80 to-amber-500/80",
    label: "Laporan Ditutup",
    description:
      "Laporan tidak dapat diproses karena tidak memenuhi kriteria atau telah dibatalkan.",
  },
};

const defaultVisual = {
  badge: "bg-slate-100 text-slate-700",
  bg: "from-slate-500/90 via-slate-600/80 to-slate-800/80",
  label: "Status Tidak Diketahui",
  description: "Periksa kembali kode laporan atau hubungi wali kelas.",
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function ReportStatusDetailPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code;

  const { data, isLoading, isError } = usePublicReportStatusQuery(code);
  const visual =
    statusVisuals[String(data?.status).toUpperCase()] ?? defaultVisual;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white">
          <div
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] md:block"
            aria-hidden="true"
          />
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16 sm:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
              Status Laporan
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Memuat status laporan…
            </h1>
            <p className="text-sm text-sky-100 sm:text-base">
              Mohon tunggu sebentar, kami sedang mengambil data laporan dengan
              kode <strong>{code}</strong>.
            </p>
          </div>
        </header>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white">
          <div
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] md:block"
            aria-hidden="true"
          />
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-16 sm:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
              Status Laporan
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Laporan tidak ditemukan
            </h1>
            <p className="text-sm text-sky-100 sm:text-base">
              Pastikan kode yang kamu masukkan benar. Jika masih tidak dapat
              ditemukan, hubungi wali kelas dengan membawa bukti pengiriman
              laporan.
            </p>
            <Button
              variant="secondary"
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 sm:w-auto"
              onClick={() => router.push("/report/status")}
            >
              Masukkan kode lain
            </Button>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] md:block"
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16 sm:px-8 lg:py-20">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
              Kode Laporan {data.code}
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Status Penanganan Pelanggaran
            </h1>
            <p className="text-sm text-sky-100 sm:text-base">
              Pantau progres laporan yang kamu kirimkan melalui sistem tata
              tertib SMKN 5 Kabupaten Tangerang. Informasi di bawah ini
              diperbarui secara real-time oleh tim kesiswaan.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {visual.label}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${visual.badge}`}
              >
                {String(data.status).toUpperCase()}
              </span>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200">
                Pelapor
              </p>
              <p className="mt-2 text-sm text-white/80">
                Dirahasiakan, hanya tim kesiswaan yang dapat melihat detail
                pelapor.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-200">
                Terakhir Diperbarui
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {formatDate(data.updatedAt) ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-10 flex w-full max-w-4xl flex-col gap-8 px-6 pb-16 sm:px-8">
        <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Deskripsi Status
            </p>
            <p className="mt-2 text-sm text-slate-600">{visual.description}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Jenis Pelanggaran
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {data.violationType}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Lokasi Kejadian
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {data.location || "-"}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-900/5">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4 text-white sm:px-8">
            <p className="text-sm font-semibold">
              Detail Siswa & Kronologi Kejadian
            </p>
          </div>
          <div className="space-y-6 px-6 py-6 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Nama Siswa
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {data.reportedName}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Kelas / Kompetensi
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {data.reportedClass}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Tanggal Kejadian
                </p>
                <p className="text-base text-slate-800">
                  {formatDate(data.occurredAt)}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Diperbarui Pada
                </p>
                <p className="text-base text-slate-800">
                  {formatDate(data.updatedAt)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Deskripsi Laporan
              </p>
              <p className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                {data.description || "Tidak ada deskripsi tambahan."}
              </p>
            </div>

            {data.evidenceUrl && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  Bukti Foto
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-900/5">
                  <img
                    src={data.evidenceUrl}
                    alt="Bukti laporan"
                    className="w-full max-h-[400px] object-contain bg-slate-950/5"
                  />
                </div>
                <Link
                  href={data.evidenceUrl}
                  target="_blank"
                  className="text-sm font-semibold text-sky-600 hover:underline"
                >
                  Lihat gambar ukuran penuh
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-6 text-sm text-slate-600 shadow-xl shadow-slate-900/5">
          <p>
            Catatan: identitas pelapor tidak ditampilkan demi menjaga
            kerahasiaan. Jika kamu memerlukan klarifikasi tambahan, hubungi wali
            kelas atau tim kesiswaan dengan membawa kode laporan{" "}
            <strong>{data.code}</strong>.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push("/report/status")}
            >
              Cari kode lain
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => router.push("/report")}
            >
              Buat laporan baru
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
