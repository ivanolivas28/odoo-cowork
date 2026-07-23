"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const LINKS = [
  { href: "/", label: "Tareas" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Conexiones" },
];

export function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // No navbar on the login screen or before we know who's here.
  if (status !== "authenticated") return null;

  return (
    <nav className="flex items-center justify-between gap-2 border-b border-[var(--border-hairline)] px-6 py-3 sm:px-10">
      <div className="flex gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--series-blue)] text-white"
                  : "text-[var(--ink-secondary)] hover:bg-[var(--grid-line)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <span className="hidden text-sm text-[var(--ink-secondary)] sm:inline">
          {session.user?.email}
        </span>
        <button
          onClick={() => signOut({ redirectTo: "/login" })}
          className="rounded-full border border-[var(--border-hairline)] px-3 py-1.5 text-sm font-medium text-[var(--ink-secondary)] hover:bg-[var(--grid-line)]"
        >
          Salir
        </button>
      </div>
    </nav>
  );
}
