import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080706]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-serif text-sm tracking-[0.25em] text-[#e8e4df]">
            {site.name.toUpperCase()}
          </p>
          <p className="mt-2 max-w-xs text-sm text-zinc-500">
            Cinematic photography & videography. Based locally, available for
            travel.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            <a
              href={site.phoneTel}
              className="text-[#d4c4a8] transition-colors hover:text-white"
            >
              {site.phoneDisplay}
            </a>
            <span className="mx-2 text-zinc-700">·</span>
            <span className="text-zinc-500">
              {site.address.street}, {site.address.region}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
          <Link href="/home" className="transition-colors hover:text-zinc-200">
            Home
          </Link>
          <Link
            href="/portfolio"
            className="transition-colors hover:text-zinc-200"
          >
            Portfolio
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-zinc-200"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-white/[0.04] py-6 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
