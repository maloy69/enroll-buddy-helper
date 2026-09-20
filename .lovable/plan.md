# Kontras hero otomatis dengan Lovable AI

Menambahkan pemeriksaan kontras khusus operator yang menganalisis gambar representatif video beserta overlay, lalu langsung menerapkan kombinasi warna teks dan opasitas overlay yang paling terbaca.

## Hasil yang dibangun

- **Tampilan awal yang aman:** tulisan hero yang sekarang putih diubah ke hijau tua agar langsung lebih jelas di atas overlay biru langit putih 55%.
- **Panel operator:** tambahkan bagian “Kontras Hero Otomatis” di halaman Pengaturan, berisi pratinjau pengaturan aktif, waktu analisis terakhir, tombol **Analisis & Terapkan**, status proses, dan pesan kesalahan yang jelas.
- **Penerapan otomatis:** saat operator menjalankan analisis, AI menilai gambar latar representatif dan overlay aktif, memilih warna teks serta opasitas overlay, lalu hasil valid langsung disimpan dan digunakan beranda tanpa langkah persetujuan tambahan.
- **Batas aman aksesibilitas:** hasil AI hanya boleh memilih nilai dari opsi desain yang telah ditentukan. Sistem menghitung ulang rasio kontras secara matematis dan menolak hasil di bawah WCAG AA; bila AI gagal, hero tetap memakai kombinasi hijau tua + overlay 55% yang aman.
- **Tampilan beranda:** hero membaca pengaturan tersimpan untuk warna tulisan utama, tulisan pendukung, dan opasitas overlay, dengan nilai bawaan yang konsisten saat data belum tersedia.

## Alur

```text
Operator membuka Pengaturan
        ↓
Klik “Analisis & Terapkan”
        ↓
Lovable AI menilai poster video + warna overlay
        ↓
Validasi rasio kontras WCAG AA
        ↓
Simpan kombinasi aman dan langsung gunakan di beranda
```

## Catatan teknis

- Gunakan server function yang dilindungi login dan pemeriksaan peran operator/admin; kunci Lovable AI tetap berada di server.
- Gunakan model `openai/gpt-6-astra` melalui Responses API dalam mode streaming, dengan keluaran terstruktur yang dibatasi pada token warna semantik dan rentang opasitas yang diizinkan.
- Analisis memakai poster video yang sudah tersedia sebagai sampel stabil, ditambah data overlay aktif. Tidak ada analisis berulang saat halaman dibuka, sehingga video tetap ringan dan biaya AI hanya muncul ketika operator menekan tombol.
- Tambahkan kolom pengaturan hero pada data pengaturan sekolah untuk menyimpan pilihan warna, opasitas, ringkasan alasan, dan waktu analisis terakhir; hak akses yang ada tetap dipertahankan.
- Tambahkan paket AI SDK yang diperlukan dan helper Gateway khusus server, serta penanganan status 400/401/402/403/429/5xx sesuai pesan aman dari Gateway.
- Perbarui tipe data setelah perubahan penyimpanan.

## Verifikasi

- Jalankan satu analisis nyata melalui panel operator dan pastikan hasil tersimpan serta langsung terlihat di beranda.
- Uji bahwa calon siswa tidak dapat menjalankan atau mengubah pengaturan AI.
- Periksa rasio kontras teks utama dan tombol minimal WCAG AA.
- Periksa beranda dan panel operator pada desktop serta ponsel, termasuk keadaan memuat, gagal, dan fallback.
