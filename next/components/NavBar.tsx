"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Projects" },
  { href: "/music", label: "Music" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/65 border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-lg tracking-tight no-underline">
          RR<span className="text-accent-red">·</span>Pinilla
        </Link>
        <nav className="hidden md:flex gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "text-sm no-underline hover:text-accent-red transition",
                pathname === l.href && "text-accent-red"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

