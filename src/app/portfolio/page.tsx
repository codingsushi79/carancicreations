"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { portfolioItems, type PortfolioItem } from "@/data/portfolio";

function FeaturedVisual({ item }: { item: PortfolioItem }) {
  return (
    <>
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#d4c4a8] backdrop-blur-sm">
        {item.category}
      </span>
    </>
  );
}

export default function PortfolioPage() {
  const featured = portfolioItems.filter((p) => p.featured);
  const rest = portfolioItems.filter((p) => !p.featured);

  return (
    <div className="flex flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
            Portfolio
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-[#f5f2ed] sm:text-5xl">
            Selected projects
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            Videography and photography work — cinematic, intentional, and
            crafted for impact.
          </p>
        </motion.header>

        <div className="mt-16 space-y-16">
          {featured.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121110] shadow-xl transition-transform duration-500 hover:scale-[1.01]"
                >
                  <FeaturedVisual item={item} />
                </Link>
              ) : (
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121110] shadow-xl">
                  <FeaturedVisual item={item} />
                </div>
              )}
              <div>
                <h2 className="font-serif text-2xl font-medium leading-snug text-[#e8e4df] sm:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-5 leading-relaxed text-zinc-500">
                  {item.description}
                </p>
                {item.href ? (
                  <span className="mt-6 inline-block text-sm font-medium text-[#a89968]">
                    View project →
                  </span>
                ) : (
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex text-sm font-medium text-[#a89968] transition-colors hover:text-[#d4c4a8]"
                  >
                    Inquire about this film →
                  </Link>
                )}
              </div>
            </motion.article>
          ))}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-colors hover:border-[#a89968]/20"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <span className="absolute left-3 top-3 rounded bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-300 backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-[#d4c4a8]">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-zinc-500">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
