"use client";

import { useState } from "react";
import Link from "next/link";

const WA_NUMBER = "6281371338032";

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);

  const resellerText = encodeURIComponent(
    "Halo Vistiq Invitation, saya ingin daftar reseller undangan digital"
  );

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
        <a href="#reseller" onClick={close}>Reseller</a>
        <Link href="/login" onClick={close}>Login</Link>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${resellerText}`}
          target="_blank"
          className="navButton"
          onClick={close}
        >
          Daftar Reseller
        </a>
      </div>
    </nav>
  );
}
