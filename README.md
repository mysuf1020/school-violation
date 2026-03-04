# School Violation Application (Aplikasi Pencatatan Pelanggaran Sekolah)

Aplikasi pencatatan pelanggaran tata tertib sekolah terintegrasi, dirancang khusus untuk memenuhi kebutuhan SMKN 5 Kabupaten Tangerang atau institusi pendidikan serupa. Proyek ini memisahkan arsitektur menjadi dua bagian utama: Frontend (menggunakan Next.js) dan Backend (menggunakan Golang).

## Fitur Utama
- **Pencatatan Poin Pelanggaran**: Mengelola bobot poin berdasarkan kategori pelanggaran tata tertib (Ringan, Sedang, Berat).
- **Akumulasi Otomatis**: Menghitung secara otomatis poin siswa dan menentukan tahapan penanganan (Pemanggilan Orang Tua, Skorsing, dll.) berdasarkan total poin pelanggaran.
- **Frontend Interaktif**: Antarmuka responsif yang dibangun menggunakan framework Next.js.
- **Backend Berperforma Tinggi**: RESTful API yang cepat dibangun menggunakan arsitektur berbasis Golang.

## Struktur Direktori

 Proyek terdiri dari dua folder utama:
 
- `/school-violation-fe` (Frontend)
   - Berbasis Next.js.
   - Digunakan untuk merender antarmuka pengguna (UI).
- `/school-violation-be` (Backend)
   - Berbasis Golang (Go).
   - Menyediakan API, mengatur logika bisnis terkait poin, dan mengelola database.

## Instalasi dan Setup Lokal

### Prasyarat
- [Bun](https://bun.sh) atau [Node.js](https://nodejs.org/) untuk menjalankan Frontend.
- [Go](https://go.dev/) untuk menjalankan Backend.
- [Air](https://github.com/cosmtrek/air) (opsional, untuk *live-reloading* Golang).

### 1. Menjalankan Backend (Go)
Masuk ke direktori `school-violation-be`:
```bash
cd school-violation-be
```
Instal dependencies dan jalankan server (biasanya berjalan di port `8080`):
```bash
go mod tidy
go run main.go
# Atau jika menggunakan air untuk live reload:
air
```

### 2. Menjalankan Frontend (Next.js)
Masuk ke direktori `school-violation-fe`:
```bash
cd school-violation-fe
```
Instal dependencies menggunakan `bun` (atau `npm`/`yarn`):
```bash
bun install
```
Jalankan development server (biasanya berjalan di port `3000` atau `3001`):
```bash
bun run dev
```

Buka `http://localhost:3000` atau `http://localhost:3001` di browser Anda untuk melihat hasilnya.

## Teknologi yang Digunakan
- **Frontend**: Next.js, React, TailwindCSS, Bun
- **Backend**: Golang (Go)

## Kontribusi
Aplikasi ini ditujukan untuk kebutuhan internal terkait sistem penanganan tata tertib dan meminimalisir intervensi manual dalam perhitungan akumulasi poin tata tertib sekolah.
