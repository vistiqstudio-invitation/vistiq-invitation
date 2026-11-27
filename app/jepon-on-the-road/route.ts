import { clothing, departure, pickups, schedule, songs } from "./program";

export const dynamic = "force-static";
const assets = "/jepon-assets";
const dates = ["Sabtu, 5 Desember", "Minggu, 6 Desember"];
const location = "Villa Pondok Kopi Umbul Sidomukti";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(location + ", Bandungan, Semarang");
const albums = ["Kompleks vila dari atas","Deretan pondok kayu","Kawasan Umbul Sidomukti","Senja di lereng gunung","Kolam dengan pemandangan lembah","Langit sore di penginapan","Teras di kawasan wisata","Kolam bertingkat","Umbul Sidomukti dengan latar pegunungan","Jalur taman di antara deretan pohon","Meja piknik menghadap senja","Panorama kolam bertingkat dari atas"];

function photos(first: number, last: number) {
  return `<div class="gallery" tabindex="0" aria-label="Foto lokasi perjalanan">${albums.slice(first, last).map((description, index) => `<img loading="lazy" src="${assets}/lokasi-${first+index+1}.webp" width="320" height="220" alt="${description}">`).join("")}</div>`;
}

export function GET() {
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jepon On The Road · Puskesmas Jepon</title><meta name="description" content="Undangan Minlok on the Road Puskesmas Jepon, 5–6 Desember 2026 di Umbul Sidomukti."><link rel="stylesheet" href="${assets}/travel.css"><script defer src="${assets}/playlist.js?v=2"></script><script defer src="${assets}/countdown.js"></script></head><body>
<header class="cover"><div class="cover-inner"><p class="eyebrow">Puskesmas Jepon</p><h1>Jepon<br><i>On the Road</i></h1><p class="motto">Satu Hati, Satu Visi</p>
<div class="postcard"><img class="picture" src="${assets}/perjalanan.webp" width="1024" height="350" fetchpriority="high" alt="Ilustrasi perjalanan bus dan kereta menuju Umbul Sidomukti"><img class="compass" src="${assets}/compass.svg" width="68" height="68" alt=""><img class="leaf" src="${assets}/leaf.svg" width="90" height="96" alt=""><p>The Last Trip with Ibu Ummi Trisnawati</p></div>
<p class="date">5–6 Desember 2026 &nbsp;·&nbsp; Bandungan</p><a class="button" id="open-journey" href="#acara">Buka undangan dengan musik ↓</a></div></header>
<main><section id="acara"><div class="soundtrack"><button id="soundtrack" class="song-choice" type="button" data-video="1-mM970N77M" aria-expanded="false"><span><small>Musik latar</small><b>Jaz · Bersamamu</b></span><em aria-hidden="true">▶</em></button></div><h2>Lokasi perjalanan</h2><h3>${location}</h3><p>Bandungan, Kabupaten Semarang</p><a class="button" href="${mapUrl}" target="_blank" rel="noopener">Cari lokasi di Google Maps ↗</a>
<div class="ticket"><h3>Menuju persiapan peserta</h3><p>5 Desember · 11.30 WIB</p><div id="countdown" role="timer">${["Hari","Jam","Menit","Detik"].map(unit => `<span><b>–</b>${unit}</span>`).join("")}</div></div>${photos(0, 3)}</section>
<nav aria-label="Isi undangan"><a href="#rundown">Rundown</a><a href="#busana">Dress code</a><a href="#jemput">Titik jemput</a><a href="#musik">Persembahan lagu</a></nav>
<section id="rundown"><h2>Rundown dua hari</h2><p>Seluruh jadwal menggunakan WIB.</p><div class="days">${schedule.map((day, index) => `<article><h3>${dates[index]}</h3><ol class="timeline">${day.map(([time,activity]) => `<li><strong>${time}</strong><span>${activity}</span></li>`).join("")}</ol></article>`).join("")}</div>${photos(3, 6)}</section>
<section id="busana"><h2>Dress code</h2><div class="outfits">${clothing.map(([when,top,rest]) => `<article><small>${when}</small><h3>${top}</h3><p>${rest}</p></article>`).join("")}</div>${photos(6, 9)}</section>
<section id="jemput"><p class="eyebrow">Sebelum berangkat</p><h2>Titik penjemputan</h2><p>Keberangkatan · ${departure} WIB</p>${pickups.length ? `<ol class="stops">${pickups.map(place => `<li>${place}</li>`).join("")}</ol>` : "<p>Urutan titik jemput menunggu konfirmasi panitia.</p>"}</section>
<section id="musik"><p class="eyebrow">Musik perjalanan</p><h2>Persembahan lagu</h2><p>13 lagu · Ketuk lagu untuk membuka pemutar di sini.</p><ol class="songs">${songs.map(([group,title,artist,id]) => `<li><button class="song-choice" type="button" data-video="${id}" aria-expanded="false"><span><small>${group}</small><b>${title}</b><span>${artist}</span></span><em aria-hidden="true">▶</em></button></li>`).join("")}</ol>${photos(9, 12)}</section></main>
<footer><p>Satu perjalanan,<br><i>sejuta kenangan.</i></p>Satu Hati, Satu Visi · Puskesmas Jepon<blockquote>“Jangan terlalu sibuk dengan prosesnya, sampai lupa menikmati perjalanannya. Bukan soal naik apa kita ke sana, tapi tentang hati yang kita bawa. Bukan tentang kemana, tapi tentang tujuannya.”</blockquote></footer></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
