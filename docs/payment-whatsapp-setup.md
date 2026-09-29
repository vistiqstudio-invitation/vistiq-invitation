# Notifikasi pembayaran WhatsApp Vistiq

Status awal: **nonaktif**. Kode dan antrean tidak menghubungkan akun WhatsApp dengan sendirinya.

- Pengirim: `6281371338032` (0813-7133-8032)
- Penerima: `6281261581332` (0812-6158-1332)
- Pengaturan owner: `/admin/payment-notifications`
- Transport: Meta WhatsApp Cloud API. Gateway dengan API berbeda memerlukan adapter tersendiri.

## Koneksi nomor

Nomor pengirim masih menggunakan aplikasi WhatsApp Business. Onboarding harus memakai jalur resmi **coexistence** dari Solution Partner/Tech Provider yang mendukung fitur tersebut dan memenuhi syarat Meta. Jangan hapus atau deregistrasikan akun WhatsApp Business untuk memaksakan pendaftaran Cloud API biasa. Pemilik nomor menyelesaikan login, persetujuan akun, dan verifikasi kepemilikan nomor melalui halaman resmi layanan. Aktivasi/paket berbayar perlu ditinjau pemilik sebelum dibeli.

## Template yang perlu diajukan

Nama: `vistiq_pembayaran_berhasil`; bahasa `id`; kategori yang diajukan `UTILITY`; format parameter `POSITIONAL`. Gunakan satu komponen BODY tanpa header, footer, atau tombol. Persetujuan/kategori akhir ditentukan Meta.

```text
Pembayaran berhasil diterima di Vistiq Invitation.
Nama: {{1}}
Nominal: {{2}}
ID pesanan: {{3}}
Metode: {{4}}
Silakan periksa detail pada dashboard Vistiq.
```

Contoh parameter: `Pelanggan Contoh`, `Rp 100.000`, `VSTQ-RC-CONTOH123`, `qris`.

## Konfigurasi server Vercel (Production)

Simpan sebagai environment variables server, jangan memakai awalan `NEXT_PUBLIC_`:

- `WHATSAPP_ACCESS_TOKEN`: token akun sistem dengan izin mengirim pesan dan membaca pengaturan/template WhatsApp; jangan memakai token uji sementara untuk produksi.
- `WHATSAPP_PHONE_NUMBER_ID`: ID Meta untuk nomor pengirim di atas, bukan nomor telepon.
- `WHATSAPP_BUSINESS_ACCOUNT_ID`: ID akun bisnis WhatsApp pemilik template.
- `WHATSAPP_GRAPH_API_VERSION`: opsional, default `v23.0`; gunakan versi yang didukung akun.

Jangan menaruh token di repo, chat, browser client, atau log. Deploy ulang setelah environment variables terpasang. Masuk sebagai owner, buka pengaturan notifikasi, lalu pilih **Periksa koneksi & aktifkan**. Server memeriksa nomor pengirim sebenarnya dan template APPROVED sebelum mengaktifkan.

## Perilaku dan batas verifikasi

- Trigger database mencatat transisi pembayaran Midtrans ke `paid` secara atomik dengan pembayaran. Tidak ada backfill atau pengiriman otomatis untuk pesanan lama ketika fitur diaktifkan.
- Pembayaran paket dan pembayaran client reseller didukung. Pembayaran manual atau transaksi tanpa ID Midtrans tidak membuat pesan.
- Pengiriman dilakukan setelah respons pembayaran. Kegagalan API WhatsApp tidak mengubah pembayaran/komisi yang sudah dicatat.
- Satu order hanya memiliki satu entri antrean. Pengiriman paralel memakai klaim terkunci agar tidak mengambil entri yang sama.
- Entri `accepted` berarti Meta menerima permintaan, **bukan** bukti pesan telah sampai atau dibaca. Webhook delivery/read receipt belum diimplementasikan.
- Penolakan HTTP 4xx menjadi `failed`; owner dapat mencoba ulang setelah penyebabnya diperbaiki. Timeout, 5xx, hasil tidak jelas, dan worker terputus menjadi `unknown`/processing lalu unknown; tidak dikirim ulang otomatis karena mungkin sudah diterima Meta.
- Antrean diproses saat callback/sinkronisasi pembayaran berhasil dan lewat tombol **Proses antrean**. Belum ada penjadwal retry berkala.
- Tombol nonaktif menghentikan pencatatan baru dan pengambilan antrean berikutnya; permintaan yang sudah dikirim ke Meta tidak bisa ditarik kembali.

Uji end-to-end dengan satu pembayaran uji yang jelas setelah koneksi dan template aktif. Pastikan WA benar-benar diterima oleh nomor tujuan. Jangan menyatakan pengiriman aktif hanya dari keberhasilan build atau respons penerimaan API.
