"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "fa-th-large" },
    { href: "/admin#about", label: "About Me", icon: "fa-user" },
    { href: "/admin#experience", label: "Experience", icon: "fa-briefcase" },
    { href: "/admin#projects", label: "Projects", icon: "fa-code" },
    { href: "/admin#skills", label: "Skills", icon: "fa-cog" },
    { href: "/admin#cv", label: "CV / Resume", icon: "fa-file-pdf" },
    { href: "/admin#contact", label: "Contact", icon: "fa-envelope" },
    { href: "/admin#colors", label: "Colors", icon: "fa-palette" },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <i className="fas fa-cog admin-brand-icon"></i>
          <div>
            <div className="admin-brand-title">Portfolio Admin</div>
            <div className="admin-brand-sub">Muhamed Ahmed</div>
          </div>
        </div>
        <nav className="admin-nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${pathname === item.href ? "active" : ""}`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span className="admin-version">v1.0 · Next.js</span>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}