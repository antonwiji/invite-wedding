# init.md — Wedding Invitation WA Message Generator

## Overview
Aplikasi web sederhana untuk mengisi dan mengirim undangan pernikahan secara online via WhatsApp.  
User memasukkan nama tamu, lalu sistem men-generate link WhatsApp yang langsung membuka chat dengan pesan undangan yang sudah terisi otomatis.

---

## Goals
- Mempermudah pengiriman undangan pernikahan digital via WhatsApp
- Mengurangi input manual dari pengirim
- Menghasilkan pesan yang konsisten dan rapi untuk setiap tamu

---

## Features

### 1. Form Input Tamu
- **Input 1 — Nama Tamu (required):** nama utama undangan (contoh: `Yoga`, `Bapak Budi`)
- **Input 2 — Nama Pasangan (optional):** nama pasangan tamu jika ada (contoh: `Ibu Sari`)
- **Tombol Submit:** men-generate pesan dan membuka WhatsApp

### 2. Generate Pesan WA
Setelah submit, sistem:
1. Menyusun nama tampilan: `[Nama Tamu]` atau `[Nama Tamu] & [Nama Pasangan]` jika pasangan diisi
2. Meng-encode nama ke URL (untuk parameter `?to=`)
3. Menyisipkan nama ke dalam template pesan
4. Membuka link WhatsApp (`wa.me` atau `api.whatsapp.com`) dengan pesan yang sudah di-encode

### 3. Template Pesan
```
Assalamu'alaikum Wr.Wb
Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i 
untuk menghadiri acara pernikahan kami

https://undanganonlineaja.id/indah-anton?to=[NAMA_TAMU]

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan 
untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini, 
karena keterbatasan jarak & waktu.

Pesan ini adalah undangan resmi sebagai pengganti apabila undangan cetak 
BELUM/TIDAK DITERIMA oleh Bapak/Ibu/Saudara/i.

Diharapkan melalui media ini sebagai pengganti undangan resmi maksud 
dan tujuan kami dapat tersampaikan.

Terima kasih banyak atas perhatiannya.
Kami yang berbahagia,
Indah & Anton
```

> `[NAMA_TAMU]` diisi otomatis dari input form, di-encode untuk URL dan pesan WA.

---

## Tech Stack (Rekomendasi)
| Layer | Pilihan |
|---|---|
| UI | HTML + CSS (single file, no framework) atau React JSX |
| Logic | Vanilla JavaScript |
| WA Integration | `https://wa.me/?text=...` (URL encode pesan) |
| Hosting | Static file — bisa di GitHub Pages, Vercel, Netlify |

---

## Flow Aplikasi

```
User buka halaman
  → Isi Input Nama Tamu (required)
  → Isi Input Nama Pasangan (optional)
  → Klik tombol "Kirim Undangan"
       ↓
  Validasi: nama tamu tidak boleh kosong
       ↓
  Susun nama: "[Nama]" atau "[Nama] & [Pasangan]"
       ↓
  Build URL undangan: https://undanganonlineaja.id/indah-anton?to=[Nama encoded]
       ↓
  Build pesan WA lengkap (template + URL)
       ↓
  Encode pesan ke encodeURIComponent()
       ↓
  Buka: window.open("https://wa.me/?text=[encoded_pesan]")
```

---

## Output yang Diharapkan

- **Link WA terbuka otomatis** di browser/aplikasi WA dengan pesan sudah terisi
- **Nama tamu muncul** di dalam URL undangan (`?to=NamaTamu`)
- **Jika ada pasangan**, tampil sebagai `NamaTamu & NamaPasangan` di URL

---

## Deliverable
- [ ] `index.html` — halaman form utama (bisa single file HTML+CSS+JS)
- [ ] Template pesan final yang sudah dikonfirmasi
- [ ] (Opsional) Preview pesan sebelum kirim
- [ ] (Opsional) Tombol copy pesan ke clipboard