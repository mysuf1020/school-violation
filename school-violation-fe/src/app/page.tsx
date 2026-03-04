import Link from 'next/link'
import clsx from 'clsx'

type SeverityTone = 'berat' | 'sedang' | 'ringan'

type ViolationRule = {
  id: number
  text: string
  points: number
}

type ViolationCategory = {
  code: string
  title: string
  description: string
  tone: SeverityTone
  rules: ViolationRule[]
}

const severityStyles: Record<
  SeverityTone,
  {
    header: string
    badge: string
    chip: string
    border: string
  }
> = {
  berat: {
    header: 'from-rose-600 via-rose-500 to-orange-400',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
    chip: 'bg-rose-500 text-white',
    border: 'border-rose-100',
  },
  sedang: {
    header: 'from-amber-500 via-orange-400 to-lime-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    chip: 'bg-amber-500 text-white',
    border: 'border-amber-100',
  },
  ringan: {
    header: 'from-sky-500 via-blue-500 to-emerald-400',
    badge: 'bg-sky-50 text-sky-700 border-sky-100',
    chip: 'bg-sky-500 text-white',
    border: 'border-sky-100',
  },
}

const violationCategories: ViolationCategory[] = [
  {
    code: 'A',
    title: 'Pelanggaran Berat',
    description:
      'Perilaku yang membahayakan keselamatan warga sekolah atau merusak nama baik institusi.',
    tone: 'berat',
    rules: [
      {
        id: 1,
        text: 'Membawa atau mengonsumsi miras, ganja, narkoba, penyalahgunaan obat-obatan dan sejenisnya yang memabukkan di sekolah.',
        points: 100,
      },
      {
        id: 2,
        text: 'Membawa, menonton, membuat, atau mengedarkan barang porno (buku, film, gambar, VCD, dan sejenisnya) di sekolah.',
        points: 100,
      },
      {
        id: 3,
        text: 'Melakukan tindak pidana atau terlibat tindak pidana (pencopetan, pemerasan, tawuran, dan lain-lain).',
        points: 100,
      },
      {
        id: 4,
        text: 'Menganiaya atau mengintimidasi Kepala Sekolah, Guru, Tenaga Kependidikan, maupun Peserta Didik.',
        points: 100,
      },
      {
        id: 5,
        text: 'Melakukan tindakan, kegiatan, atau perbuatan asusila.',
        points: 100,
      },
      {
        id: 6,
        text: 'Membawa atau menggunakan senjata tajam tanpa izin Guru atau senjata api.',
        points: 100,
      },
      {
        id: 7,
        text: 'Memalsukan stempel sekolah.',
        points: 100,
      },
      {
        id: 8,
        text: 'Menikah, hamil di luar nikah, atau menghamili.',
        points: 100,
      },
      {
        id: 9,
        text: 'Bertato, bertindik, piercing, dan sejenisnya.',
        points: 100,
      },
      {
        id: 10,
        text: 'Mengikuti atau menjadi anggota organisasi terlarang (Camp5Java), gengster, atau berandal motor.',
        points: 95,
      },
      {
        id: 11,
        text: 'Merencanakan, melihat, atau berada di tempat tawuran dengan peserta didik dari sekolah lain.',
        points: 95,
      },
      {
        id: 12,
        text: 'Memalsukan tanda tangan Orang Tua, Kepala Sekolah, Guru, atau Tenaga Kependidikan.',
        points: 90,
      },
      {
        id: 13,
        text: 'Mencemarkan nama baik Sekolah, Guru, Kepala Sekolah, atau Tenaga Kependidikan.',
        points: 90,
      },
    ],
  },
  {
    code: 'B',
    title: 'Pelanggaran Sedang',
    description:
      'Perilaku yang mengganggu ketertiban dan wibawa sekolah sehingga membutuhkan pembinaan intensif.',
    tone: 'sedang',
    rules: [
      {
        id: 1,
        text: 'Berjudi, taruhan, atau sejenisnya (dengan media apa pun) di lingkungan sekolah.',
        points: 75,
      },
      {
        id: 2,
        text: 'Berkelahi atau terlibat perkelahian dengan peserta didik di lingkungan sekolah.',
        points: 75,
      },
      {
        id: 3,
        text: 'Mengancam warga sekolah.',
        points: 55,
      },
      {
        id: 4,
        text: 'Menerobos atau melompat pagar (bolos).',
        points: 55,
      },
      {
        id: 5,
        text: 'Bersikap atau bertingkah laku tidak sopan terhadap Kepala Sekolah, Guru, atau Tenaga Kependidikan.',
        points: 55,
      },
      {
        id: 6,
        text: 'Merusak sarana prasarana milik sekolah atau warga sekolah dengan sengaja.',
        points: 55,
      },
      {
        id: 7,
        text: 'Merokok atau membawa rokok di lingkungan sekolah maupun di luar sekolah ketika masih memakai seragam.',
        points: 55,
      },
      {
        id: 8,
        text: 'Melakukan tindakan sexual bullying terhadap teman atau pihak lain.',
        points: 55,
      },
    ],
  },
  {
    code: 'C',
    title: 'Pelanggaran Ringan',
    description:
      'Kebiasaan kurang disiplin sehari-hari yang perlu diarahkan agar budaya sekolah tetap positif.',
    tone: 'ringan',
    rules: [
      {
        id: 1,
        text: 'Mencoret sarana prasarana sekolah.',
        points: 25,
      },
      {
        id: 2,
        text: 'Membuat pernyataan bohong, dusta, atau palsu.',
        points: 25,
      },
      {
        id: 3,
        text: 'Melakukan tindakan bullying verbal terhadap teman atau siapapun.',
        points: 25,
      },
      {
        id: 4,
        text: 'Melakukan tindakan cyber atau sosial bullying terhadap teman atau siapapun.',
        points: 25,
      },
      {
        id: 5,
        text: 'Memarkir kendaraan di sekolah saat kegiatan belajar mengajar berlangsung.',
        points: 25,
      },
      {
        id: 6,
        text: 'Meninggalkan kelas atau pembelajaran tanpa izin guru.',
        points: 10,
      },
      {
        id: 7,
        text: 'Mengabaikan surat panggilan dari sekolah.',
        points: 10,
      },
      {
        id: 8,
        text: 'Mengabaikan panggilan Kepala Sekolah, Guru, atau Tenaga Kependidikan.',
        points: 10,
      },
      {
        id: 9,
        text: 'Membuat gaduh atau mengganggu kegiatan pembelajaran.',
        points: 10,
      },
      {
        id: 10,
        text: 'Membuang sampah sembarangan atau merusak taman.',
        points: 10,
      },
      {
        id: 11,
        text: 'Mencontek atau bekerja sama saat ujian.',
        points: 10,
      },
      {
        id: 12,
        text: 'Berada di kelas atau tidak mengikuti upacara, apel pagi, dan pembiasaan di lapangan tanpa izin.',
        points: 10,
      },
      {
        id: 13,
        text: 'Tidak masuk sekolah tanpa keterangan.',
        points: 10,
      },
      {
        id: 14,
        text: 'Model rambut tidak sesuai ketentuan atau mewarnai selain hitam.',
        points: 5,
      },
      {
        id: 15,
        text: 'Terlambat masuk sekolah atau terlambat mengikuti pembelajaran.',
        points: 5,
      },
      {
        id: 16,
        text: 'Tidak membawa tempat makan atau tempat minum.',
        points: 5,
      },
      {
        id: 17,
        text: 'Tidak membawa Al-Qur’an setiap Selasa dan Jumat, tidak melaksanakan ibadah, atau tidak mengisi agenda ibadah.',
        points: 5,
      },
      {
        id: 18,
        text: 'Seragam tidak sesuai ketentuan, atribut tidak lengkap, atau memakai jaket/sweater di dalam sekolah.',
        points: 5,
      },
      {
        id: 19,
        text: 'Memakai ikat pinggang, kaos kaki, atau sepatu tidak sesuai ketentuan.',
        points: 5,
      },
      {
        id: 20,
        text: 'Peserta didik putra memakai perhiasan (gelang, kalung, dan lain-lain).',
        points: 5,
      },
      {
        id: 21,
        text: 'Peserta didik putri memakai perhiasan atau make-up berlebihan, tidak memakai ciput dan legging.',
        points: 5,
      },
    ],
  },
]

const sanctionSteps = [
  {
    range: '0 – 25',
    handling:
      'Peserta didik menandatangani surat pernyataan tertulis, diketahui orang tua/wali, dan dilakukan pembinaan.',
  },
  {
    range: '26 – 50',
    handling:
      'Peserta didik menandatangani surat pernyataan tertulis, orang tua/wali dipanggil atau dihubungi, serta menerima Surat Peringatan I.',
  },
  {
    range: '51 – 75',
    handling:
      'Orang tua/wali dipanggil atau dihubungi untuk pembinaan lanjutan, peserta didik menerima Surat Peringatan II.',
  },
  {
    range: '76 – 99',
    handling:
      'Orang tua/wali dipanggil ke sekolah untuk pembinaan khusus dan peserta didik menerima Surat Peringatan III.',
  },
  {
    range: '100',
    handling: 'Peserta didik dikembalikan ke orang tua/wali.',
  },
]

const identityFields = [
  {
    label: 'Nama Peserta Didik',
    placeholder: '..................................................',
  },
  {
    label: 'Kelas / Kompetensi Keahlian',
    placeholder: '..................................................',
  },
  {
    label: 'Tahun Pelajaran',
    placeholder: '2024 / 2025',
  },
]

const totalRules = violationCategories.reduce(
  (total, category) => total + category.rules.length,
  0,
)

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-sky-900 to-sky-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_65%)] md:block"
          aria-hidden="true"
        />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 sm:px-10 lg:py-20">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">
              Form. 04
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Bobot Poin Pelanggaran Tata Tertib Peserta Didik SMKN 5
                Kabupaten Tangerang
              </h1>
              <p className="max-w-3xl text-sm text-sky-100 sm:text-base">
                Panduan resmi untuk memastikan peserta didik memahami konsekuensi
                setiap pelanggaran dan menjaga lingkungan belajar yang aman,
                tertib, serta berkarakter.
              </p>
            </div>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <dt className="text-xs uppercase tracking-widest text-sky-200">
                Tahun Pelajaran
              </dt>
              <dd className="text-2xl font-semibold">2024 / 2025</dd>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <dt className="text-xs uppercase tracking-widest text-sky-200">
                Total Pelanggaran
              </dt>
              <dd className="text-2xl font-semibold">{totalRules} Aturan</dd>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <dt className="text-xs uppercase tracking-widest text-sky-200">
                Bobot Maksimum
              </dt>
              <dd className="text-2xl font-semibold">100 Poin</dd>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <dt className="text-xs uppercase tracking-widest text-sky-200">
                Lokasi Sekolah
              </dt>
              <dd className="text-2xl font-semibold">
                Kab. Tangerang
              </dd>
            </div>
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-sky-100">
              Perlu melaporkan pelanggaran yang terjadi di lingkungan sekolah?
            </p>
            <Link
              href="/report"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5"
            >
              Laporkan Pelanggaran
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-10 flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 sm:px-10">
        <section className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-3">
          {identityFields.map((field) => (
            <div key={field.label} className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                {field.label}
              </p>
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 font-semibold tracking-[0.3em] text-slate-500">
                {field.placeholder}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Bobot Pelanggaran
            </p>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">
                Rincian Peraturan Sesuai Kategori Pelanggaran
              </h2>
              <p className="text-sm text-slate-500">
                Semakin berat pelanggaran, semakin tinggi bobot poin yang akan
                dikumpulkan peserta didik.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {violationCategories.map((category) => {
              const styles = severityStyles[category.tone]
              return (
                <article
                  key={category.code}
                  className={clsx(
                    'overflow-hidden rounded-3xl border bg-white shadow-lg shadow-slate-900/5',
                    styles.border,
                  )}
                >
                  <div
                    className={clsx(
                      'bg-gradient-to-r p-6 text-white sm:p-8',
                      styles.header,
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                          Kategori {category.code}
                        </p>
                        <h3 className="text-2xl font-semibold">
                          {category.title}
                        </h3>
                        <p className="text-sm text-white/85">
                          {category.description}
                        </p>
                      </div>
                      <span
                        className={clsx(
                          'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-widest',
                          styles.chip,
                        )}
                      >
                        {category.rules.length} Aturan
                      </span>
                    </div>
                  </div>

                  <ul className="divide-y divide-slate-100">
                    {category.rules.map((rule) => (
                      <li
                        key={`${category.code}-${rule.id}`}
                        className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
                      >
                        <div className="flex flex-1 items-start gap-4">
                          <span className="text-lg font-semibold text-slate-400">
                            {String(rule.id).padStart(2, '0')}
                          </span>
                          <p className="text-base text-slate-700">
                            {rule.text}
                          </p>
                        </div>
                        <span
                          className={clsx(
                            'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold',
                            styles.badge,
                          )}
                        >
                          {rule.points} Poin
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Sanksi & Pembinaan
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Tahapan Penanganan Berdasarkan Akumulasi Poin
            </h2>
            <p className="text-sm text-slate-500">
              Setiap pelanggaran tercatat dalam buku tata tertib dan ditindak
              lanjut sesuai rentang poin sehingga peserta didik dan orang tua
              memahami proses pembinaan.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-900/5">
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4 text-white sm:px-8">
              <p className="text-sm font-semibold">
                Akumulasi poin menentukan tingkat pembinaan hingga tindakan
                administratif.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold sm:px-8">No.</th>
                    <th className="px-6 py-3 font-semibold sm:px-8">
                      Rentang Poin
                    </th>
                    <th className="px-6 py-3 font-semibold sm:px-8">
                      Penanganan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sanctionSteps.map((sanction, index) => (
                    <tr key={sanction.range} className="align-top">
                      <td className="px-6 py-4 font-semibold text-slate-500 sm:px-8">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 sm:px-8">
                        {sanction.range} Poin
                      </td>
                      <td className="px-6 py-4 text-slate-600 sm:px-8">
                        {sanction.handling}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
