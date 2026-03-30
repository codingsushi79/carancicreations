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
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={32}
                    height={32}
                    className="hidden rounded-full border border-white/10 sm:block"
                  />
                ) : null}
                <span className="hidden max-w-[7rem] truncate text-zinc-400 sm:inline">
                  {session.user.name ?? session.user.email}
                </span>
                <Link
                  href="/account"
                  className={`px-2 py-2 transition-colors sm:px-3 ${
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
