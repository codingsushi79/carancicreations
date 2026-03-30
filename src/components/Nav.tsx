"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/home", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/request", label: "Request job" },
  { href: "/contact", label: "Contact" },
] as const;

const accountMenuLinks = [
  { href: "/account", label: "Overview" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/phones", label: "Phones" },
  { href: "/account/invoices", label: "Invoices" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0a0908]/80 backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/home"
          className="group flex flex-col leading-none transition-opacity hover:opacity-90"
        >
          <span className="font-serif text-lg tracking-[0.18em] text-[#e8e4df] sm:text-xl">
            BLANK
          </span>
          <span className="font-serif text-[10px] tracking-[0.5em] text-[#a89968] sm:text-[11px]">
            CREATIONS
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative px-3 py-2 text-sm font-medium tracking-wide transition-colors sm:px-4 ${
                      active
                        ? "text-[#d4c4a8]"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {label}
                    {active ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-x-2 bottom-1 h-px bg-[#a89968]/90"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="flex max-w-[min(100vw-12rem,14rem)] items-center gap-2 text-sm sm:max-w-none sm:gap-3">
            {status === "authenticated" && session?.user ? (
              <>
                <div className="group relative hidden sm:block">
                  <div
                    className="flex cursor-default items-center gap-2 rounded-lg py-1.5 pl-1 pr-2 outline-none hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#a89968]/40"
                    tabIndex={0}
                    aria-haspopup="true"
                    aria-label="Account menu"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full border border-white/10"
                      />
                    ) : (
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-medium text-zinc-400"
                        aria-hidden
                      >
                        {(session.user.name ?? session.user.email ?? "?")
                          .slice(0, 1)
                          .toUpperCase()}
                      </span>
                    )}
                    <span className="max-w-[9rem] truncate text-sm text-zinc-300">
                      {session.user.name ?? session.user.email}
                    </span>
                    <span className="text-[10px] text-zinc-600" aria-hidden>
                      ▾
                    </span>
                  </div>
                  <div
                    className="invisible absolute right-0 top-full z-[60] min-w-[13rem] pt-2 opacity-0 transition-[opacity,visibility] duration-150 ease-out group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
                    role="menu"
                    aria-label="Account pages"
                  >
                    <div className="rounded-xl border border-white/[0.1] bg-[#121110]/95 py-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06] backdrop-blur-xl">
                      {accountMenuLinks.map(({ href, label }) => {
                        const active =
                          href === "/account"
                            ? pathname === "/account"
                            : pathname.startsWith(href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            role="menuitem"
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              active
                                ? "bg-[#a89968]/15 text-[#d4c4a8]"
                                : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                            }`}
                          >
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Link
                  href="/account"
                  className={`px-2 py-2 transition-colors sm:hidden ${
                    pathname.startsWith("/account")
                      ? "text-[#d4c4a8]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Account
                </Link>
                {session.user.role === "MANAGER" ? (
                  <Link
                    href="/dashboard"
                    className={`px-2 py-2 transition-colors sm:px-3 ${
                      pathname.startsWith("/dashboard")
                        ? "text-[#d4c4a8]"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Dashboard
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/home" })}
                  className="whitespace-nowrap rounded-full border border-white/15 px-2.5 py-1.5 text-zinc-300 transition-colors hover:border-white/25 hover:text-white sm:px-3"
                >
                  Sign out
                </button>
              </>
            ) : status === "loading" ? (
              <span
                className="h-8 w-20 animate-pulse rounded-md bg-white/[0.06]"
                aria-hidden
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-2 py-2 transition-colors sm:px-3 ${
                    pathname === "/login"
                      ? "text-[#d4c4a8]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className={`rounded-full border px-2.5 py-1.5 transition-colors sm:px-4 ${
                    pathname === "/signup"
                      ? "border-[#a89968] bg-[#a89968]/25 text-[#f5f2ed]"
                      : "border-[#a89968]/40 bg-[#a89968]/10 text-[#d4c4a8] hover:bg-[#a89968]/20"
                  }`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
