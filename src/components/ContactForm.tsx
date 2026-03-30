"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { submitContactInquiry } from "@/app/actions/inquiries";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitContactInquiry(fd);
      if (res.ok) {
        setDone(true);
        e.currentTarget.reset();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={submit}
      className="space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Name
          </span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            disabled={pending}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none ring-[#a89968]/0 transition-[border-color,box-shadow,ring] placeholder:text-zinc-600 focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Email
          </span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            disabled={pending}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none transition-[border-color,box-shadow,ring] placeholder:text-zinc-600 focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
            placeholder="you@email.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Project type
        </span>
        <select
          name="type"
          required
          disabled={pending}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none transition-[border-color,box-shadow,ring] focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
        >
          <option value="Photography">Photography</option>
          <option value="Videography">Videography</option>
          <option value="Both / not sure">Both / not sure</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Message
        </span>
        <textarea
          required
          name="message"
          rows={5}
          disabled={pending}
          className="w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none transition-[border-color,box-shadow,ring] placeholder:text-zinc-600 focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
          placeholder="Tell us about your timeline, location, and vision…"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}
      <motion.button
        type="submit"
        disabled={pending}
        whileHover={{ scale: pending ? 1 : 1.01 }}
        whileTap={{ scale: pending ? 1 : 0.99 }}
        className="w-full rounded-lg bg-[#a89968] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#0c0b0a] transition-colors hover:bg-[#bfb08a] disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Sending…" : "Send inquiry"}
      </motion.button>
      {done ? (
        <p className="text-sm leading-relaxed text-[#d4c4a8]">
          Thank you — we received your message and will reply soon. You can
          also reach us at{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-white underline decoration-[#a89968]/50 underline-offset-2 hover:decoration-white"
          >
            {site.email}
          </a>
          .
        </p>
      ) : null}
    </motion.form>
  );
}
