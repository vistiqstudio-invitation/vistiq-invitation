@echo off
setlocal
cd /d "%~dp0"
title Vistiq Cloudflare Deployment
echo =======================================
echo  VISTIQ - CLOUDFLARE DEPLOYMENT
echo =======================================
echo.
if not exist ".open-next\worker.js" (
  echo ERROR: File .open-next\worker.js tidak ada.
  echo Extract seluruh file ZIP terlebih dahulu, jangan dijalankan dari dalam ZIP.
  pause
  exit /b 1
)
if not exist "wrangler.jsonc" (
  echo ERROR: File wrangler.jsonc tidak ada.
  pause
  exit /b 1
)
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js belum tersedia.
  pause
  exit /b 1
)
echo Memeriksa akun Cloudflare yang sudah login...
call npx --yes wrangler whoami
if errorlevel 1 (
  echo ERROR: Wrangler belum login. Jalankan npx wrangler login --device lalu coba lagi.
  pause
  exit /b 1
)
echo.
echo Paket build sudah dibuat dan diverifikasi di GitHub Actions.
echo Worker tujuan: vistiq-recovery-preview
echo Domain dan routes existing dikelola di Cloudflare Dashboard.
echo Secret runtime Supabase dan Cloudflare tidak diganti.
echo.
set /p "confirm=Ketik DEPLOY untuk mengupdate website Vistiq: "
if /I not "%confirm%"=="DEPLOY" (
  echo Deployment dibatalkan. Website tetap seperti semula.
  pause
  exit /b 0
)
echo.
call npx --yes wrangler deploy --keep-vars
if errorlevel 1 (
  echo.
  echo DEPLOY GAGAL. Jangan ulang berulang kali. Kirim pesan error saja.
  pause
  exit /b 1
)
echo.
echo DEPLOY SELESAI. Uji halaman reseller dan link undangan lama.
pause
endlocal
