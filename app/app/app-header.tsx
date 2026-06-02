"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/tonight", label: "Tonight" },
  { href: "/deals", label: "All Deals" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/carryout", label: "Carryout" }
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="appHeader">
      <Link href="/tonight" className="brand" aria-label="Deal Finder home">
        <span className="brandMark" aria-hidden="true" />
        <span>
          <strong>Deal Finder</strong>
          <small>Wilmington, NC</small>
        </span>
      </Link>
      <nav className="topNav" aria-label="Primary">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href as Route}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
