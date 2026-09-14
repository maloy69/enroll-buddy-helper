# Beranda SPMB bergaya hero video

Mengganti tampilan halaman depan SPMB dengan gaya hero layar penuh berlatar video yang berputar bolak-balik (boomerang), memakai teks dan tombol khas pendaftaran murid baru.

## Tampilan baru

- **Latar**: video dari tautan CloudFront yang Anda berikan, ditampilkan penuh layar dengan lapisan gelap tipis agar tulisan tetap terbaca. Video diputar maju lalu mundur tanpa jeda.
- **Bar atas**: logo + nama sekolah di kiri, menu tengah (Alur, Jurusan, Pengumuman) berbentuk pil putih transparan, tombol "Masuk" dan "Daftar Sekarang" di kanan. Di layar kecil menu berubah jadi tombol garis tiga dengan panel geser dari kanan.
- **Judul utama**: "Pendaftaran Murid Baru" dengan tahun ajaran dari pengaturan sekolah, plus kalimat pendukung singkat.
- **Blok kiri bawah**: nama sekolah, penjelasan singkat proses pendaftaran daring, dan dua tombol: "Mulai Pendaftaran" dan "Lihat Alur".
- **Blok kanan bawah**: penanda status pendaftaran (dibuka/belum dibuka) sesuai jadwal.

Bagian bawah beranda yang sudah ada (Jadwal Penting, keunggulan, daftar jurusan) tetap dipertahankan di bawah hero.

## Perilaku

- Kalau video gagal dimuat atau pengguna memilih "kurangi gerakan", latar otomatis memakai foto sekolah yang sudah ada sehingga halaman tetap rapi.
- Animasi menu, panel geser, dan tombol memakai transisi CSS ringan.
- Tampilan diperiksa di lebar ponsel dan desktop.

## Catatan teknis

- Komponen baru `src/components/BoomerangVideoBg.tsx`: menangkap frame video ke canvas (lebar maks 960px) lalu memutarnya maju-mundur pada 30fps. Dibungkus agar hanya berjalan di browser (tidak saat render server), dengan fallback `<video loop muted playsinline>`/gambar.
- `src/routes/index.tsx`: bagian hero lama diganti komponen hero baru; sisa seksi tetap. Ikon dari `lucide-react`, animasi pakai kelas `transition-*` Tailwind (tanpa framer-motion di hero).
- Warna hero dipetakan ke token desain baru di `src/styles.css` (oklch) sesuai palet hijau yang diberikan — tanpa kode warna langsung di komponen.
- Font tetap Plus Jakarta Sans yang sudah terpasang; tidak menambah dependensi baru.
- Judul/deskripsi halaman (head) beranda disesuaikan dengan teks hero baru.
