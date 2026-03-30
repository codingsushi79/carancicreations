import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/AuthForms";

export const metadata: Metadata = {
  title: "Log in",
  description: "Member login — Caranci Creations.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-md">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
          Members
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[#f5f2ed] sm:text-4xl">
          Log in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Sign in with Google (Auth.js) or use the email fields as a placeholder
          until you add credentials auth. Copy{" "}
          <code className="rounded bg-white/5 px-1 text-zinc-400">.env.example</code>{" "}
          to <code className="rounded bg-white/5 px-1 text-zinc-400">.env.local</code>{" "}
          and set <code className="rounded bg-white/5 px-1 text-zinc-400">AUTH_SECRET</code>{" "}
          plus Google OAuth credentials.
        </p>
        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <LoginForm />
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
