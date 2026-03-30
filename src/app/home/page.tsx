"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { site, services } from "@/data/site";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
} as const;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-24 pt-12 sm:px-8 sm:pb-32 sm:pt-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,153,104,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_50%,rgba(80,60,40,0.2),transparent)]" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]"
          >
            Cinematic studio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-4xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-[#f5f2ed] sm:text-5xl md:text-6xl md:leading-[1.05]"
          >
            {site.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
          >
            {site.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/portfolio"
              className="inline-flex rounded-full bg-[#a89968] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#0c0b0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore collection
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium tracking-wide text-zinc-200 transition-colors hover:border-[#a89968]/50 hover:text-white"
            >
              Book a project
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#080706]/80 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <motion.div {...fade}>
            <h2 className="font-serif text-2xl font-medium text-[#e8e4df] sm:text-3xl">
              Featured work
            </h2>
            <p className="mt-4 text-zinc-500">
              A glimpse of the frame — full projects live in the portfolio.
            </p>
          </motion.div>
          <motion.div
            {...fade}
            transition={{ ...fade.transition, delay: 0.08 }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40"
          >
            <Image
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80"
              alt="Cinematic photography"
              fill
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            {...fade}
            className="font-serif text-2xl font-medium text-[#e8e4df] sm:text-3xl"
          >
            Services
          </motion.h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 transition-[border-color,background-color] duration-500 hover:border-[#a89968]/25 hover:bg-white/[0.03]"
              >
                <h3 className="font-serif text-xl text-[#d4c4a8]">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-zinc-500">
                  {s.description}
                </p>
                <Link
                  href={s.href}
                  className="mt-6 inline-flex text-sm font-medium text-[#a89968] transition-colors group-hover:text-[#d4c4a8]"
                >
                  {s.cta} →
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-gradient-to-b from-[#a89968]/[0.07] to-transparent px-5 py-16 sm:px-8 sm:py-20">
        <motion.div
          {...fade}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-serif text-2xl text-[#f5f2ed] sm:text-3xl">
            Join the list
          </h2>
          <p className="mt-4 text-zinc-400">
            New clients: ask about an exclusive{" "}
            <span className="font-medium text-[#d4c4a8]">20% off</span> your
            first booking when you reach out through our contact page.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full border border-[#a89968]/50 bg-[#a89968]/10 px-8 py-3 text-sm font-semibold text-[#d4c4a8] transition-colors hover:bg-[#a89968]/20"
          >
            Get in touch
          </Link>
        </motion.div>
      </section>
    </>
  );
}
