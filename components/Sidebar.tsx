import Image from "next/image";
import NavItem from "./NavItem";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", icon: "fa-home", label: "Home" },
  { href: "/about", icon: "fa-user", label: "About" },
  { href: "/experience", icon: "fa-briefcase", label: "Experience" },
  { href: "/projects", icon: "fa-code", label: "Projects" },
  { href: "/skills", icon: "fa-cog", label: "Skills" },
  { href: "/cv", icon: "fa-file-pdf", label: "CV" },
  { href: "/contact", icon: "fa-envelope", label: "Contact" },
];

export default function Sidebar({ name }: { name: string }) {
  const [first, ...rest] = name.trim().split(/\s+/);

  return (
    <aside className="sidebar">
      <div className="profile-pic">
        <Image
          src="/my.jpg"
          alt="Muhamed Ahmed"
          width={120}
          height={120}
          priority
        />
        <h2>
          <span>{first}</span> {rest.join(" ")}
        </h2>
        <div className="sub">Software Developer · CS Grad</div>
      </div>
      <nav className="nav-list">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
      <div className="dark-toggle-wrap">
        <span>
          <i className="fas fa-palette"></i> Theme
        </span>
        <ThemeToggle />
      </div>
    </aside>
  );
}