"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const type = String(data.get("type") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = encodeURIComponent(
      `[Caranci Creations] ${type} — ${name}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nType: ${type}\n\n${message}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
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
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none ring-[#a89968]/0 transition-[border-color,box-shadow,ring] placeholder:text-zinc-600 focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
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
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none transition-[border-color,box-shadow,ring] placeholder:text-zinc-600 focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
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
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none transition-[border-color,box-shadow,ring] focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
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
          className="w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none transition-[border-color,box-shadow,ring] placeholder:text-zinc-600 focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
          placeholder="Tell us about your timeline, location, and vision…"
        />
      </label>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full rounded-lg bg-[#a89968] px-6 py-3.5 text-sm font-semibold tracking-wide text-[#0c0b0a] transition-colors hover:bg-[#bfb08a] sm:w-auto"
      >
        Send inquiry
      </motion.button>
      {sent ? (
        <p className="text-sm text-[#a89968]">
          Opening your email app — adjust the address in{" "}
          <code className="rounded bg-white/5 px-1">ContactForm.tsx</code> if
          needed.
        </p>
      ) : null}
    </motion.form>
  );
}
