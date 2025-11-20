# Buku Panduan Sistem Antrian
## Dinas Perhubungan Kabupaten Semarang

### Versi 1.0
### Tanggal: Desember 2024

---

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Persyaratan Sistem](#persyaratan-sistem)
3. [Instalasi dan Setup](#instalasi-dan-setup)
4. [Struktur Sistem](#struktur-sistem)
5. [Panduan Pengguna](#panduan-pengguna)
   - [5.1. Layar Tampilan Utama](#51-layar-tampilan-utama)
   - [5.2. Pendaftaran Antrian](#52-pendaftaran-antrian)
   - [5.3. Login Admin](#53-login-admin)
   - [5.4. Login Petugas](#54-login-petugas)
6. [Panduan Admin](#panduan-admin)
   - [6.1. Manajemen Antrian](#61-manajemen-antrian)
   - [6.2. Pengaturan Tampilan](#62-pengaturan-tampilan)
   - [6.3. Manajemen Petugas](#63-manajemen-petugas)
   - [6.4. Pengaturan Sistem](#64-pengaturan-sistem)
   - [6.5. Riwayat Antrian](#65-riwayat-antrian)
7. [Panduan Petugas](#panduan-petugas)
   - [7.1. Manajemen Antrian](#71-manajemen-antrian)
   - [7.2. Pengaturan Sistem](#72-pengaturan-sistem)
   - [7.3. Riwayat Antrian](#73-riwayat-antrian)
8. [Fitur Tambahan](#fitur-tambahan)
9. [Pemeliharaan Sistem](#pemeliharaan-sistem)
10. [Troubleshooting](#troubleshooting)
11. [Daftar Istilah](#daftar-istilah)

---

## 1. Pendahuluan

Sistem Antrian Dinas Perhubungan Kabupaten Semarang adalah aplikasi web-based yang dirancang untuk mengelola antrian pelayanan pengujian kendaraan bermotor. Sistem ini memfasilitasi proses antrian untuk dua jenis angkutan:

- **Angkutan Umum**: Kendaraan yang digunakan untuk angkutan penumpang umum
- **Angkutan Barang**: Kendaraan yang digunakan untuk angkutan barang

Sistem ini terdiri dari beberapa komponen utama:
- Layar tampilan utama untuk informasi antrian
- Sistem pendaftaran antrian mandiri
- Panel admin untuk pengelolaan sistem
- Panel petugas untuk penanganan antrian

---

## 2. Persyaratan Sistem

### Perangkat Keras Minimum:
- Processor: Intel Core i3 atau setara
- RAM: 4 GB
- Storage: 500 MB ruang kosong
- Monitor: 1920x1080 atau lebih tinggi (untuk layar tampilan)

### Perangkat Lunak:
- Browser web modern (Chrome, Firefox, Edge, Safari)
- Sistem operasi: Windows 7+, macOS 10.12+, Linux
- Web server (Apache/Nginx) untuk deployment production

### Browser Support:
- Google Chrome 80+
- Mozilla Firefox 75+
- Microsoft Edge 80+
- Safari 13+

---

## 3. Instalasi dan Setup

### 3.1. Setup Development
1. Clone atau download semua file sistem ke folder web server
2. Pastikan struktur folder sebagai berikut:
```
sistem_antrian/
├── admin.html
├── admin.js
├── petugas.html
├── petugas_script.js
├── urut.html
├── urut.js
├── login_page.html
├── login_script.js
├── script.js
├── style.css
├── login_style.css
├── assets/
│   ├── logo.png
│   ├── slide1.jpg
│   ├── slide2.jpg
│   └── slide3.jpg
└── README.md
```

3. Buka `login_page.html` di browser untuk memulai sistem

### 3.2. Setup Production
1. Upload semua file ke web server
2. Pastikan server mendukung HTTPS untuk keamanan
3. Konfigurasi CORS jika diperlukan
4. Setup backup otomatis untuk data localStorage

### 3.3. Konfigurasi Awal
- **Password Admin Default**: `admin123`
- **Petugas Default**:
  - Username: `petugas1`, Password: `password1`
  - Username: `petugas2`, Password: `password2`

---

## 4. Struktur Sistem

```
┌─────────────────┐    ┌─────────────────┐
│   Login Page    │    │  Queue Display  │
│                 │    │   (script.js)   │
│ - Admin Login   │    │                 │
│ - Petugas Login │    │ - Current Queue │
└─────────┬───────┘    │ - Next Queues   │
          │            │ - Slideshow     │
          │            │ - Running Text  │
          └────────────┘
                   │
          ┌────────▼────────┐
          │                 │
          │  Queue System   │
          │   (localStorage)│
          │                 │
          └────────┬────────┘
                   │
        ┌──────────▼──────────┐
        │                     │
        │   Admin Panel       │◄──┐
        │                     │   │
        │ - Queue Management  │   │
        │ - Display Settings  │   │
        │ - Petugas Management│   │
        │ - System Settings   │   │
        │ - History           │   │
        └─────────────────────┘   │
                                  │
        ┌─────────────────────┐   │
        │                     │   │
        │   Petugas Panel     │   │
        │                     │   │
        │ - Queue Management  │   │
        │ - System Settings   │   │
        │ - History           │   │
        └─────────────────────┘   │
                                  │
        ┌─────────────────────┐   │
        │                     │   │
        │   Queue Registration│   │
        │   (urut.html)       │   │
        │                     │   │
        │ - Take Queue Number │   │
        │ - Print Ticket      │   │
        └─────────────────────┘   │
                                  │
                                  │
                    ┌─────────────▼─────────────┐
                    │                           │
                    │       Queue History       │
                    │   (PDF/Excel Export)      │
                    └───────────────────────────┘
```

---

## 5. Panduan Pengguna

### 5.1. Layar Tampilan Utama

Layar tampilan utama menampilkan informasi antrian real-time yang dapat dilihat oleh pengguna yang sedang menunggu.

#### Fitur yang Tersedia:
- **Nomor Antrian Saat Ini**: Menampilkan nomor antrian yang sedang dipanggil
- **Antrian Berikutnya**: Menampilkan 10 nomor antrian berikutnya
- **Slideshow**: Menampilkan gambar-gambar informasi
- **Teks Berjalan**: Menampilkan informasi penting
- **Waktu dan Tanggal**: Menampilkan waktu real-time

#### Cara Menggunakan:
1. Layar akan otomatis menampilkan informasi terbaru
2. Perhatikan nomor antrian Anda
3. Tunggu hingga nomor Anda dipanggil
4. Ikuti petunjuk petugas saat dipanggil

### 5.2. Pendaftaran Antrian

Halaman pendaftaran antrian memungkinkan pengguna mengambil nomor antrian secara mandiri.

#### Langkah-langkah:
1. Buka halaman `urut.html` atau akses melalui link yang disediakan
2. Pilih jenis angkutan:
   - **Angkutan Umum**: Untuk kendaraan penumpang
   - **Angkutan Barang**: Untuk kendaraan barang
3. Klik tombol "Ambil Nomor Antrian"
4. Sistem akan memberikan nomor antrian (contoh: U001, B001)
5. Simpan nomor antrian atau cetak tiket jika diperlukan

#### Fitur Cetak Tiket:
- Klik "Cetak Tiket" untuk mencetak tiket antrian
- Tiket berisi nomor antrian, tanggal, dan waktu

### 5.3. Login Admin

Admin memiliki akses penuh ke semua fitur sistem.

#### Cara Login:
1. Buka `login_page.html`
2. Klik tombol "Login Admin"
3. Masukkan password (default: `admin123`)
4. Klik "Login"

### 5.4. Login Petugas

Petugas dapat mengelola antrian dan melihat riwayat.

#### Cara Login:
1. Buka `login_page.html`
2. Klik tombol "Login Petugas"
3. Masukkan username dan password
4. Klik "Login"

---

## 6. Panduan Admin

### 6.1. Manajemen Antrian

#### Memanggil Antrian Berikutnya:
1. Masuk ke panel Admin
2. Klik menu "Manajemen Antrian"
3. Klik tombol "Panggil Berikutnya"
4. Sistem akan memanggil nomor antrian berikutnya dan mengumumkannya

#### Menyelesaikan Antrian:
1. Setelah pelayanan selesai, klik "Antrian Selesai"
2. Antrian akan dipindahkan ke riwayat dengan status "Selesai"

#### Membatalkan Antrian:
1. Klik "Batalkan Antrian" jika pelayanan tidak dapat dilanjutkan
2. Antrian akan dipindahkan ke riwayat dengan status "Tidak Terselesaikan"

#### Mereset Antrian:
1. Klik "Reset Antrian" untuk menghapus semua antrian
2. **Peringatan**: Tindakan ini tidak dapat dibatalkan

#### Mengupdate Catatan Antrian:
1. Masukkan informasi penting di kolom "Catatan Antrian"
2. Klik "Perbarui Catatan"
3. Catatan akan ditampilkan di layar utama

### 6.2. Pengaturan Tampilan

#### Mengubah Identitas Instansi:
1. Klik menu "Pengaturan Tampilan"
2. Masukkan nama instansi baru
3. Upload logo baru jika diperlukan
4. Klik "Simpan Pengaturan"

#### Mengelola Slideshow:
1. Tambah slide baru dengan mengklik "Tambah Slide"
2. Masukkan URL gambar atau upload file
3. Edit atau hapus slide yang ada
4. Sistem akan otomatis menyimpan perubahan

#### Mengatur Teks Berjalan:
1. Masukkan teks yang ingin ditampilkan
2. Klik "Simpan Pengaturan"
3. Teks akan berjalan di layar utama

### 6.3. Manajemen Petugas

#### Menambah Petugas Baru:
1. Klik menu "Manajemen Petugas"
2. Masukkan username dan password
3. Konfirmasi password
4. Klik "Tambah Petugas"

#### Mengedit Petugas:
1. Klik ikon edit pada daftar petugas
2. Masukkan username dan password baru
3. Simpan perubahan

#### Menghapus Petugas:
1. Klik ikon hapus pada daftar petugas
2. Konfirmasi penghapusan

### 6.4. Pengaturan Sistem

#### Mengubah Password Admin:
1. Klik menu "Pengaturan Sistem"
2. Masukkan password saat ini
3. Masukkan password baru
4. Konfirmasi password baru
5. Klik "Ubah Password"

### 6.5. Riwayat Antrian

#### Melihat Riwayat:
1. Klik menu "Riwayat Antrian"
2. Sistem menampilkan semua riwayat antrian

#### Filter Riwayat:
- **Filter Jenis Angkutan**: Pilih "Angkutan Umum" atau "Angkutan Barang"
- **Filter Status**: Pilih status antrian
- **Filter Tanggal**: Pilih tanggal spesifik

#### Download Riwayat:
- **Download PDF**: Klik "Download PDF" untuk laporan PDF
- **Download Excel**: Klik "Download Excel" untuk file spreadsheet

#### Menghapus Riwayat:
- **Hapus Terpilih**: Pilih entri tertentu dan klik "Hapus Terpilih"
- **Hapus Semua**: Klik "Hapus Riwayat" untuk menghapus semua data

---

## 7. Panduan Petugas

### 7.1. Manajemen Antrian

Petugas memiliki akses terbatas untuk manajemen antrian.

#### Memanggil Antrian:
1. Login sebagai petugas
2. Klik "Panggil Berikutnya"
3. Sistem akan mencatat petugas yang memanggil

#### Menyelesaikan Antrian:
1. Hanya petugas yang memanggil antrian yang dapat menyelesaikannya
2. Klik "Antrian Selesai" setelah pelayanan selesai

#### Mereset Antrian:
1. Klik "Reset Antrian" dengan konfirmasi

### 7.2. Pengaturan Sistem

#### Mengubah Password:
1. Masukkan password saat ini
2. Masukkan password baru
3. Konfirmasi dan simpan

### 7.3. Riwayat Antrian

Petugas dapat melihat riwayat antrian dengan filter yang sama seperti admin, namun tidak dapat menghapus data.

---

## 8. Fitur Tambahan

### 8.1. Pengumuman Suara

Sistem menggunakan Web Speech API untuk mengumumkan:
- Nomor antrian yang dipanggil
- Instruksi kepada pengguna

### 8.2. Real-time Updates

Sistem menggunakan localStorage events untuk update real-time antar browser tabs.

### 8.3. Responsive Design

Interface sistem responsif dan dapat diakses dari berbagai perangkat.

### 8.4. Auto-backup

Data tersimpan di localStorage browser dan dapat di-backup secara manual.

---

## 9. Pemeliharaan Sistem

### 9.1. Backup Data

#### Cara Manual Backup:
1. Buka Developer Tools browser (F12)
2. Klik tab "Application" atau "Storage"
3. Klik "Local Storage"
4. Export data localStorage

#### Restore Data:
1. Import data ke localStorage
2. Refresh halaman

### 9.2. Update Sistem

1. Download versi terbaru
2. Backup data penting
3. Replace file lama dengan yang baru
4. Test semua fungsi
5. Restore data jika diperlukan

### 9.3. Monitoring Sistem

#### Mengecek Status:
- Monitor penggunaan memori browser
- Periksa console browser untuk error
- Pastikan semua file ter-load dengan benar

---

## 10. Troubleshooting

### 10.1. Masalah Umum

#### Sistem Tidak Responsif:
- **Solusi**: Refresh halaman atau restart browser
- **Penyebab**: Cache browser penuh atau JavaScript error

#### Data Hilang:
- **Solusi**: Restore dari backup
- **Penyebab**: localStorage terhapus atau browser di-reset

#### Suara Tidak Berfungsi:
- **Solusi**: Periksa pengaturan browser untuk Web Speech API
- **Penyebab**: Browser tidak mendukung atau permission ditolak

#### Login Gagal:
- **Solusi**: Pastikan username/password benar
- **Penyebab**: Password salah atau akun petugas tidak ada

### 10.2. Error Messages

#### "Tidak ada antrian berikutnya":
- Berarti semua antrian sudah dipanggil
- Solusi: Tunggu pengguna baru mengambil antrian

#### "Password tidak valid":
- Password yang dimasukkan salah
- Solusi: Gunakan password yang benar atau reset jika lupa

#### "Username sudah ada":
- Username petugas sudah terdaftar
- Solusi: Gunakan username yang berbeda

---

## 11. Daftar Istilah

- **Admin**: Pengguna dengan akses penuh ke sistem
- **Petugas**: Staf yang menangani antrian pelayanan
- **Antrian Saat Ini**: Nomor antrian yang sedang dipanggil
- **Angkutan Umum**: Kendaraan untuk angkutan penumpang
- **Angkutan Barang**: Kendaraan untuk angkutan barang
- **LocalStorage**: Penyimpanan data di browser
- **Slideshow**: Tampilan gambar bergantian
- **Teks Berjalan**: Informasi yang bergerak horizontal
- **Web Speech API**: Fitur browser untuk text-to-speech

---

## Lampiran

### A. Kode Error

| Kode | Deskripsi | Solusi |
|------|-----------|--------|
| ERR_001 | Login gagal | Periksa username/password |
| ERR_002 | Data tidak tersimpan | Periksa localStorage browser |
| ERR_003 | File tidak ditemukan | Pastikan semua file ter-upload |
| ERR_004 | Browser tidak didukung | Gunakan browser modern |

### B. Shortcut Keyboard

| Shortcut | Fungsi |
|----------|--------|
| F5 | Refresh halaman |
| F12 | Buka Developer Tools |
| Ctrl+Shift+I | Inspect element |
| Ctrl+U | View page source |

### C. File Sistem

| File | Deskripsi |
|------|-----------|
| admin.html | Halaman panel admin |
| admin.js | JavaScript untuk admin |
| petugas.html | Halaman panel petugas |
| petugas_script.js | JavaScript untuk petugas |
| urut.html | Halaman ambil antrian |
| urut.js | JavaScript untuk ambil antrian |
| script.js | JavaScript untuk layar tampilan |
| style.css | CSS untuk styling |
| login_page.html | Halaman login utama |
| login_script.js | JavaScript untuk login |

---

**Catatan**: Buku panduan ini dapat diperbarui sesuai dengan perkembangan sistem. Untuk pertanyaan lebih lanjut, hubungi tim IT Dinas Perhubungan Kabupaten Semarang.

**Versi Dokumen**: 1.0
**Tanggal Terbit**: November 2025
**Dibuat Oleh**: Tim Developer Sistem Antrian
