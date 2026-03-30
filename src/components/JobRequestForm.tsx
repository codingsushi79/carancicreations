"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { submitJobInquiry } from "@/app/actions/inquiries";

export function JobRequestForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitJobInquiry(fd);
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
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
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
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Phone (optional)
        </span>
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          disabled={pending}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
        />
      </label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Service
          </span>
          <select
            name="projectType"
            disabled={pending}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
          >
            <option value="Photography">Photography</option>
            <option value="Videography">Videography</option>
            <option value="Both">Both</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Event / shoot date (optional)
          </span>
          <input
            name="eventDate"
            type="text"
            placeholder="e.g. June 14, 2026"
            disabled={pending}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
          />
        </label>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Location (optional)
          </span>
          <input
            name="location"
            type="text"
            disabled={pending}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
            Budget range (optional)
          </span>
          <input
            name="budget"
            type="text"
            placeholder="e.g. $2k–5k"
            disabled={pending}
            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Project details
        </span>
        <textarea
          required
          name="message"
          rows={6}
          disabled={pending}
          className="w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20 disabled:opacity-50"
          placeholder="Describe the scope, deliverables, references, and anything else we should know."
        />
      </label>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#a89968] px-8 py-3.5 text-sm font-semibold text-[#0c0b0a] transition-colors hover:bg-[#bfb08a] disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit job request"}
      </button>
      {done ? (
        <p className="text-sm text-[#d4c4a8]">
          Request received. We&apos;ll review and get back to you shortly.
        </p>
      ) : null}
    </motion.form>
  );
}
