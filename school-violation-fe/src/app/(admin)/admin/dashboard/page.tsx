"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from "@/components/ui";
import { Page } from "@/components/commons";
import { useDashboardOverviewQuery } from "@/lib/hooks/queries/use-dashboard-overview";
import { DashboardStat } from "./_components/dashboard-stats";
import {
  Users,
  ShieldCheck,
  FileWarning,
  GraduationCap,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading } = useDashboardOverviewQuery();

  const stats = [
    {
      label: "Total Siswa",
      value: data?.total_students ?? 0,
      icon: Users,
      helper: "Peserta didik terdaftar aktif",
      tone: "sky" as const,
    },
    {
      label: "Total Pelanggaran",
      value: data?.total_violations ?? 0,
      icon: ShieldCheck,
      helper: "Catatan pelanggaran sejak awal tahun",
      tone: "amber" as const,
    },
    {
      label: "Laporan Pending",
      value: data?.total_pending_reports ?? 0,
      icon: FileWarning,
      helper: "Menunggu tindak lanjut tim BK",
      tone: "emerald" as const,
    },
    {
      label: "Total Kelas",
      value: data?.total_classes ?? 0,
      icon: GraduationCap,
      helper: "Kelas aktif dalam sistem",
      tone: "indigo" as const,
    },
  ];

  return (
    <Page>
      <Page.Header>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Page.Title>Dashboard Pengawasan</Page.Title>
            <p className="max-w-2xl text-sm text-white/80 sm:text-base">
              Monitor pelanggaran siswa, tindak lanjuti laporan publik, dan
              pantau jumlah kelas agar pembinaan berjalan seragam di seluruh
              SMKN 5 Kabupaten Tangerang.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="rounded-full bg-white/90 px-6 text-slate-900 hover:bg-white"
              onClick={() => router.push("/report")}
            >
              Lihat Form Publik
            </Button>
            <Button
              className="rounded-full bg-sky-500 px-6 text-white hover:bg-sky-600"
              onClick={() => router.push("/admin/reports")}
            >
              Kelola Laporan
            </Button>
          </div>
        </div>
      </Page.Header>

      <Page.Body>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              loading={isLoading}
              icon={stat.icon}
              helper={stat.helper}
              tone={stat.tone}
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-0 bg-white/95 shadow-lg shadow-slate-900/5">
            <CardHeader>
              <CardTitle>Prioritas Penanganan</CardTitle>
              <CardDescription>
                Gunakan alur berikut agar laporan publik cepat terselesaikan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-sm text-slate-600">
                <li>
                  <span className="font-semibold text-slate-900">
                    1. Validasi fakta
                  </span>{" "}
                  — cek bukti dan hubungi pelapor jika perlu klarifikasi.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">
                    2. Koordinasi kelas
                  </span>{" "}
                  — informasikan wali kelas / guru BK untuk pembinaan awal.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">
                    3. Update status
                  </span>{" "}
                  — ubah status laporan agar warga sekolah bisa melihat
                  perkembangan.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">
                    4. Dokumentasi
                  </span>{" "}
                  — catat hasil pembinaan pada modul pelanggaran siswa.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/95 shadow-lg shadow-slate-900/5">
            <CardHeader>
              <CardTitle>Akses Cepat</CardTitle>
              <CardDescription>
                Navigasi langsung ke modul operasional yang paling sering
                digunakan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="justify-start rounded-2xl border-slate-200 py-5 text-slate-700"
                  onClick={() => router.push("/admin/students")}
                >
                  Kelola Data Siswa &amp; Kelas
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-2xl border-slate-200 py-5 text-slate-700"
                  onClick={() => router.push("/admin/violations")}
                >
                  Input Pelanggaran Harian
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-2xl border-slate-200 py-5 text-slate-700"
                  onClick={() => router.push("/admin/violation-types")}
                >
                  Update Jenis Pelanggaran
                </Button>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-500">
                <Text level="s" className="text-slate-600">
                  Catatan:
                </Text>
                Pastikan setiap perubahan data di koordinasikan dengan tim BK
                agar bobot poin tetap sesuai dengan tata tertib terbaru.
              </div>
            </CardContent>
          </Card>
        </div>
      </Page.Body>
    </Page>
  );
}
