"use client";

import { useState } from "react";
import Link from "next/link";

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <Link href="/" className="brand" onClick={close}>
        <div>
          <p>VISTIQ</p>
          <h1>Invitation</h1>
        </div>
      </Link>

      <button
        type="button"
        className="menuToggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Buka menu"
      >
        <span>{open ? "Tutup" : "Menu"}</span>
        {open ? "✕" : "☰"}
      </button>

      {open && <div className="navBackdrop" onClick={close} />}

      <div className={open ? "navMenu navMenuOpen" : "navMenu"}>
        <a href="/" onClick={close}>Home</a>
        <a href="#fitur" onClick={close}>Fitur</a>
        <a href="#tema" onClick={close}>Tema</a>
        <a href="#harga" onClick={close}>Harga</a>
        <Link href="/gabung-reseller" onClick={close}>Reseller</Link>
        <Link href="/gabung-resellerbrand" onClick={close}>Reseller Brand</Link>
        <Link href="/gabung-affiliate" onClick={close}>Affiliate</Link>
        <Link href="/login" onClick={close}>Login</Link>
        <Link href="/gabung-reseller" className="navButton" onClick={close}>
          Daftar Reseller
        </Link>
      </div>
    </nav>
  );
}
