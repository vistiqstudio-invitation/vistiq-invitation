"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="navbarWrap"><div className="navbar">
      <Link href="/" className="brand" onClick={close}>
        <Image src="/vistiq-invitation-logo.png" alt="Vistiq Invitation" width={900} height={282} priority />
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
        <Link href="/" onClick={close}>Home</Link>
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
