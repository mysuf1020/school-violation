"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useAuthStore } from "@/lib/auth-store";
import api from "@/lib/http";

export default function LoginPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.post("/admin/auth/login", {
        username,
        password,
      });

      // ambil respons BE
      const token = res.data?.token;
      const role = res.data?.role;

      if (!token || !role) {
        setErrorMsg("Response login tidak valid");
        return;
      }

      // simpan ke auth store
      login({
        token,
        username,
        role,
      });

      // refresh react-query
      qc.invalidateQueries();

      // redirect
      router.push("/admin/dashboard");
    } catch {
      setErrorMsg("Username atau password salah");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-5">
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white lg:col-span-3">
          <div
            className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] md:block"
            aria-hidden="true"
          />
          <div className="mx-auto flex h-full max-w-3xl flex-col gap-10 px-8 py-16">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
                School Violation Back Office
              </p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Ruang Kendali Tata Tertib SMKN 5 Kabupaten Tangerang
              </h1>
              <p className="text-sm text-sky-100 sm:text-base">
                Pantau laporan pelanggaran, tindak lanjuti pembinaan, dan
                pastikan seluruh siswa memegang teguh budaya disiplin sekolah
                melalui satu dashboard terpadu.
              </p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <dt className="text-xs uppercase tracking-[0.35em] text-sky-200">
                  Laporan Aktif
                </dt>
                <dd className="mt-2 text-2xl font-semibold">24+</dd>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <dt className="text-xs uppercase tracking-[0.35em] text-sky-200">
                  Guru & BK
                </dt>
                <dd className="mt-2 text-2xl font-semibold">30 akun</dd>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                <dt className="text-xs uppercase tracking-[0.35em] text-sky-200">
                  Monitoring
                </dt>
                <dd className="mt-2 text-2xl font-semibold">Real-time</dd>
              </div>
            </dl>

            <p className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm text-sky-100 backdrop-blur">
              Akses dashboard hanya untuk akun resmi yang dikelola oleh tim
              kesiswaan. Lupa kata sandi? Hubungi administrator sekolah.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-16 lg:col-span-2">
          <Card className="w-full max-w-md border border-slate-100 p-8 shadow-xl shadow-slate-900/5">
            <div className="space-y-8">
              <div className="space-y-2 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Masuk Sistem
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Login Admin & BK
                </h2>
                <p className="text-sm text-slate-500">
                  Gunakan kredensial yang diberikan sekolah untuk mengakses
                  dashboard pengelolaan pelanggaran.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Username
                  </label>
                  <Input
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  disabled={loading}
                >
                  {loading ? "Masuk..." : "Masuk Dashboard"}
                </Button>
              </form>

              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-4 text-center text-sm text-slate-500">
                Butuh mengirim laporan sebagai warga sekolah? Gunakan{" "}
                <Link
                  href="/report"
                  className="font-semibold text-sky-600 hover:underline"
                >
                  formulir publik
                </Link>{" "}
                tanpa login.
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
