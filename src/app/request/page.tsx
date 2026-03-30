import type { Metadata } from "next";
import Link from "next/link";
import { JobRequestForm } from "@/components/JobRequestForm";

export const metadata: Metadata = {
  title: "Request a job",
  description: "Submit a detailed photography or videography job request.",
};

export default function RequestPage() {
  return (
    <div className="relative flex flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_0%,rgba(168,153,104,0.12),transparent)]" />
      </div>
      <div className="relative mx-auto w-full max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
          Booking
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-[#f5f2ed] sm:text-5xl">
          Job request
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-500">
          Tell us about your shoot or production. This goes straight to our
          team dashboard — no account required.
        </p>
        <div className="mt-10 rounded-2xl border border-white/[0.1] bg-[#121110]/60 p-6 ring-1 ring-white/[0.04] backdrop-blur-sm sm:p-8">
          <JobRequestForm />
        </div>
        <p className="mt-8 text-center text-sm text-zinc-600">
          <Link href="/contact" className="text-[#a89968] hover:underline">
            General question instead? → Contact
          </Link>
        </p>
      </div>
    </div>
  );
}
