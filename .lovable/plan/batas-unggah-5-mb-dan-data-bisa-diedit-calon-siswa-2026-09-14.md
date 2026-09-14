# Batas Unggah 5 MB dan Data Bisa Diedit Calon Siswa

## Yang berubah

1. **Ukuran unggahan maksimal 5 MB per berkas** (sebelumnya 2 MB).
   - Batas dicek di formulir sebelum berkas dikirim, dengan pesan yang menyebut 5 MB.
   - Teks panduan unggah di halaman pendaftaran diperbarui: "PDF, PNG, JPG, TIFF — maks. 5 MB · foto otomatis dikecilkan".
   - Batas penyimpanan berkas di server dinaikkan ke 5 MB agar unggahan besar tidak ditolak.

2. **Calon siswa bisa mengedit datanya sampai diverifikasi operator.**
   - Status Draf dan Terkirim: formulir tetap bisa dibuka dan disimpan, dokumen bisa diganti atau dihapus.
   - Setelah status Terverifikasi / Diterima / Tidak diterima / Daftar ulang / Ditolak: formulir terkunci seperti sekarang, dengan penjelasan statusnya.
   - Di halaman formulir untuk status Terkirim ditampilkan catatan: "Data masih bisa diubah sampai operator memverifikasi."

## Detail teknis

- `src/components/DocumentUploader.tsx`: `MAX_BYTES` menjadi `5 * 1024 * 1024`, teks `TEKS_FORMAT` dan pesan error disesuaikan. Kompresi gambar ke WebP tetap berjalan.
- Batas bucket `dokumen` dinaikkan ke 5MB lewat alat pengaturan storage.
- `src/routes/pendaftaran.tsx`: `terkunci` menjadi benar hanya jika status bukan `draft` dan bukan `submitted`; tambah banner info saat status `submitted`; `locked` pada bagian dokumen mengikuti nilai `terkunci` yang sama.
- Migrasi basis data: ganti kebijakan RLS "pendaftaran diubah pemilik draft" pada `public.registrations` menjadi izin UPDATE untuk pemilik saat `status IN ('draft','submitted')`, dengan WITH CHECK yang menjaga `user_id = auth.uid()` dan status tetap di antara kedua nilai itu (calon siswa tidak bisa menaikkan statusnya sendiri menjadi terverifikasi/diterima).
- Kebijakan dokumen sudah mengizinkan pemilik menambah/mengubah/menghapus, jadi tidak berubah; pemicu otomatis draft→terkirim tetap berlaku.

## Verifikasi

- Cek tipe (`tsgo`), lalu uji alur di pratinjau: unggah berkas ~4 MB berhasil, dan pendaftar berstatus Terkirim masih bisa membuka serta menyimpan formulirnya.
