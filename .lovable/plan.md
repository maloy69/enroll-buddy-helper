# Pilihan Alamat Bertingkat (Provinsi → Kabupaten → Kecamatan → Desa)

Mengganti isian alamat yang saat ini diketik manual pada formulir pendaftaran dengan pilihan bertingkat memakai data wilayah resmi yang Anda unggah (Kepmendagri 2025, ±91.000 baris).

## Cara kerja

Data wilayah disimpan di database, bukan ikut dimuat ke halaman. Halaman hanya mengambil daftar yang sedang dibutuhkan:

```text
Provinsi (38 pilihan)  → dimuat saat langkah alamat dibuka
  Kabupaten/Kota       → dimuat setelah provinsi dipilih
    Kecamatan          → dimuat setelah kabupaten dipilih
      Desa/Kelurahan   → dimuat setelah kecamatan dipilih
```

Setiap daftar hanya puluhan sampai ratusan baris, jadi halaman tetap ringan dan cepat dibuka. Mengganti pilihan di tingkat atas otomatis mengosongkan pilihan di bawahnya.

## Yang berubah di formulir

- Empat isian teks (Provinsi, Kabupaten/Kota, Kecamatan, Kelurahan/Desa) menjadi pilihan dropdown dengan kotak pencarian, sehingga bisa diketik untuk menyaring.
- Validasi tetap sama: keempatnya wajib diisi.
- Nama wilayah yang tersimpan di data pendaftar tetap berupa teks seperti sekarang, jadi kartu pendaftaran, cetak PDF, dan halaman operator tidak perlu diubah.
- Isian Alamat (jalan/RT/RW) dan Kode pos tetap diketik manual.
- Isian Tempat lahir tetap memakai saran otomatis yang sudah ada.

## Rincian teknis

- Tabel baru `public.wilayah (kode varchar(13) primary key, nama text)` dengan indeks pada `nama` dan indeks prefix `kode`; GRANT SELECT ke `anon` dan `authenticated`, RLS aktif dengan kebijakan baca publik.
- Impor ±91.000 baris dari `wilayah.sql` yang diunggah, dikonversi dari sintaks MySQL ke PostgreSQL dan dimasukkan bertahap melalui tool data (bukan migrasi skema).
- Tingkat wilayah ditentukan dari panjang kode: `11` provinsi, `11.01` kabupaten/kota, `11.01.01` kecamatan, `11.01.01.2001` desa. Query anak memakai `kode LIKE '<induk>.%' AND length(kode) = <panjang anak>`.
- Komponen baru `src/components/WilayahSelect.tsx` (Command/Popover dari shadcn) plus hook pengambil data via React Query dengan `staleTime` panjang agar tidak fetch berulang.
- Dipakai di `src/routes/pendaftaran.tsx`; `src/components/operator/RegistrationForm.tsx` menyusul dengan komponen yang sama.
- Nilai yang disimpan ke kolom `province`, `city`, `district`, `village` tetap nama wilayah (teks), sehingga data lama tetap terbaca.
