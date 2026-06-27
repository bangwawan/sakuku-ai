<div align="center">
  <img src="public/pwa-192x192.png" alt="Sakuku AI Logo" width="120" />

  # 💸 Sakuku AI (Nuxt Finance)
  
  **Aplikasi Manajemen Keuangan Pribadi Berbasis AI & PWA**
  
  [![Nuxt 3](https://img.shields.io/badge/Nuxt_3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
  [![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)]()
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)]()
</div>

<br>

**Sakuku AI** adalah aplikasi pencatatan keuangan modern yang dirancang untuk kecepatan, keamanan, dan wawasan cerdas. Dilengkapi dengan teknologi *Progressive Web App* (PWA) agar terasa seperti aplikasi *native* di HP Anda, serta terintegrasi dengan Google Gemini AI untuk memberikan analisis pengeluaran harian Anda!

---

## ✨ Fitur Unggulan

- 🤖 **AI Insight (Gemini AI)**: Dapatkan ringkasan dan analisis cerdas mengenai kebiasaan pengeluaran Anda.
- 📱 **PWA Ready**: Pasang aplikasi ini langsung ke *Homescreen* (Layar Beranda) Android/iOS Anda. Mendukung akses cepat & *offline caching*.
- 🗄️ **Smart Dual-Database Engine**: Aplikasi secara otomatis beralih menggunakan **MySQL** di komputer lokal Anda, dan memakai **Neon PostgreSQL** ketika diluncurkan ke Vercel! Tidak perlu repot bongkar *code*!
- 📸 **Base64 Immutable Storage**: Bukti transaksi (*struk*) disimpan dengan aman menggunakan kompresi *Base64* untuk mencegah masalah kehilangan gambar di penyimpanan awan *serverless*.
- 👥 **Role-Based Access Control**: Mendukung sistem multi-akun dengan batasan ketat (Administrator & Pencatat).
- 📊 **Visualisasi Dasbor**: Grafik interaktif pengeluaran bulanan Anda.

---

## 🚀 Cara Menjalankan Secara Lokal (Local Development)

Proyek ini dibangun menggunakan **Nuxt 3** dan menggunakan **MySQL** untuk pengembangan lokal.

### 1. Persiapan
Pastikan Anda sudah memasang:
- [Node.js](https://nodejs.org/en) (v18+)
- [XAMPP](https://www.apachefriends.org/index.html) atau [Laragon](https://laragon.org/) (untuk MySQL lokal)

### 2. Kloning Repositori
```bash
git clone https://github.com/bangwawan/sakuku-ai.git
cd sakuku-ai
npm install
```

### 3. Persiapan Database Lokal
1. Buka PHPMyAdmin atau SQL Client Anda.
2. Buat *database* baru (contoh: `finance_db`).
3. Impor (*import*) tabel struktur dari berkas `schema-postgres.sql` (struktur tabel sudah terstandardisasi untuk MySQL & Postgres).

### 4. Konfigurasi Lingkungan (.env)
Buat berkas `.env` di direktori utama, lalu isikan data berikut:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=finance_db
```
*(Catatan: Anda bisa memasukkan Gemini API Key langsung ke tabel `pengaturan` lewat UI halaman Kelola).*

### 5. Jalankan Server
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`.

---

## ☁️ Cara Meluncurkan ke Vercel (Deployment)

Aplikasi ini sudah dioptimasi **100% kompatibel** dengan ekosistem *serverless* Vercel!

1. Buat repositori ini menjadi Publik/Privat di akun Github Anda.
2. Masuk ke [Vercel](https://vercel.com) dan impor repositori ini.
3. Di *Dashboard* Vercel, masuk ke menu **Storage** ➔ Buat **Postgres** (menggunakan Neon).
4. Sambungkan *Postgres Storage* tersebut ke *Project* Anda (ini akan otomatis memasukkan `POSTGRES_URL` ke `.env` Vercel Anda).
5. Masuk ke tab **Query** di Vercel Postgres, lalu jalankan semua baris kueri SQL dari berkas `schema-postgres.sql`.
6. Klik **Deploy**! 🚀

---

## 🔐 Akun Default Administrator
Saat aplikasi baru pertama kali dipasang, pastikan Anda menambahkan akun Administrator langsung ke dalam *database*:
- Username: `admin`
- PIN: `123456` (Gunakan format *MD5 Hash* di database, contoh MD5 untuk 123456 adalah `e10adc3949ba59abbe56e057f20f883e`)
- Role: `administrator`

---

## 🛠️ Stack Teknologi Terapan
- **Framework:** Nuxt 3 (Vue 3, Nitro)
- **Styling:** CSS
- **Database Driver:** `mysql2` & `pg`
- **PWA:** `@vite-pwa/nuxt`
- **Kriptografi:** Node.js `crypto` MD5

<p align="center">
  <i>Dibuat dengan ❤️ untuk pengelolaan keuangan yang lebih baik.</i>
</p>
