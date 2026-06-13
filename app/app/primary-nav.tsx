"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/tonight", label: "Today" },
  { href: "/deals", label: "All Deals" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/report", label: "Report" }
] as const;

const southportNavItems = [
  { href: "/southport", label: "Today" },
  { href: "/southport/deals", label: "All Deals" },
  { href: "/southport/restaurants", label: "Restaurants" }
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/southport") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PrimaryNav() {
  const pathname = usePathname();
  const items = pathname.startsWith("/southport") ? southportNavItems : navItems;

  return (
    <nav className="primaryContentNav" aria-label="Primary">
      {items.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href as Route}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
