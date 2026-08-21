"use client";

import { useState } from "react";
import Link from "next/link";

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="navbarWrap"><div className="navbar">
      <Link href="/" className="brand" onClick={close}>
        <span className="brandMark">V</span><span className="brandWord">vistiq<small>INVITATION</small></span>
      </Link>

      <button
        type="button"
        className="menuToggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Buka menu"
      >
        <span className="srOnly">{open ? "Tutup" : "Menu"}</span>
        {open ? "×" : "☰"}
      </button>

      <Link href="/login" className="mobileLogin" onClick={close}>Login <span>→</span></Link>

      {open && <div className="navBackdrop" onClick={close} />}

      <div className={open ? "navMenu navMenuOpen" : "navMenu"}>
        <a href="/" onClick={close}>Home</a>
        <a href="#fitur" onClick={close}>Fitur</a>
        <a href="#tema" onClick={close}>Tema</a>
        <a href="#harga" onClick={close}>Harga</a>
        <Link href="/gabung-reseller" onClick={close}>Reseller</Link>
        <Link href="/gabung-resellerbrand" onClick={close}>Reseller Brand</Link>
        <Link href="/gabung-affiliate" onClick={close}>Affiliate</Link>
        <Link href="/login" className="loginButton" onClick={close}>Login <span>→</span></Link>
        <Link href="/gabung-reseller" className="navButton" onClick={close}>
          Daftar Reseller
        </Link>
      </div>
    </div></nav>
  );
}
