import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/AuthForms";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an account — Caranci Creations.",
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-md">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
          Members
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[#f5f2ed] sm:text-4xl">
          Create account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Same as login: Wix handled sign-up inside their app shell. This page
          mirrors a typical email + password flow so you can plug in real auth
          later.
        </p>
        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <SignupForm />
        </div>
        <p className="mt-8 text-center text-xs text-zinc-600">
          <Link href="/home" className="text-zinc-500 hover:text-zinc-300">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
