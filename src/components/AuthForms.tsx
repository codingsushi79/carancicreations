"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export function LoginForm() {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <GoogleSignInButton label="Sign in with Google" />
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <p className="relative text-center text-xs uppercase tracking-wider text-zinc-600">
          <span className="bg-[#0a0908] px-3">or email</span>
        </p>
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-[#a89968] py-3.5 text-sm font-semibold text-[#0c0b0a] transition-colors hover:bg-[#bfb08a]"
      >
        Log in
      </button>
      {done ? (
        <p className="text-sm text-amber-200/90">
          UI only — connect this form to your auth provider (e.g. Clerk, Auth.js,
          Supabase). Wix member accounts do not transfer automatically.
        </p>
      ) : null}
      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href="/signup" className="text-[#d4c4a8] hover:underline">
          Create one
        </Link>
      </p>
    </motion.form>
  );
}

export function SignupForm() {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={onSubmit}
      className="space-y-5"
    >
      <GoogleSignInButton label="Sign up with Google" />
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <p className="relative text-center text-xs uppercase tracking-wider text-zinc-600">
          <span className="bg-[#0a0908] px-3">or email</span>
        </p>
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Full name
        </span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-zinc-100 outline-none focus:border-[#a89968]/40 focus:ring-2 focus:ring-[#a89968]/20"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-lg bg-[#a89968] py-3.5 text-sm font-semibold text-[#0c0b0a] transition-colors hover:bg-[#bfb08a]"
      >
        Create account
      </button>
      {done ? (
        <p className="text-sm text-amber-200/90">
          UI only — hook this to your auth backend. Original Wix site used Wix
          Members (modal), not crawlable sign-up HTML.
        </p>
      ) : null}
      <p className="text-center text-sm text-zinc-500">
        Already registered?{" "}
        <Link href="/login" className="text-[#d4c4a8] hover:underline">
          Log in
        </Link>
      </p>
    </motion.form>
  );
}
