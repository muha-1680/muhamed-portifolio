"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About Me" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({
  firstName,
  profilePhoto,
}: {
  firstName: string;
  profilePhoto: string;
}) {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`nav ${open ? "menu-open" : ""}`}>
      <a href="#home" className="brand" onClick={() => setOpen(false)}>
        {firstName}
        <span>.</span>
      </a>
      <div
        className={`nav-backdrop ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />
      <div className="nav-links">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={active === l.href ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <a href="#contact" className="nav-cta drawer-cta" onClick={() => setOpen(false)}>
          Let&apos;s Talk
        </a>
      </div>
      <a href="#contact" className="nav-cta desktop-cta" onClick={() => setOpen(false)}>
        Let&apos;s Talk
      </a>
      <Image
        src={profilePhoto}
        alt=""
        width={36}
        height={36}
        className="nav-avatar"
      />
      <button
        type="button"
        className="nav-burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <i className={`fas ${open ? "fa-xmark" : "fa-bars"}`}></i>
      </button>
    </nav>
  );
}
