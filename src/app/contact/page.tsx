import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book photography or videography with Caranci Creations.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
            Contact
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium text-[#f5f2ed] sm:text-5xl">
            Let&apos;s create together
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-500">
            Share your date, location, and creative direction. We&apos;ll follow
            up with availability and next steps.
          </p>
          <div className="mt-10 space-y-4 text-sm text-zinc-400">
            <p>
              <span className="text-zinc-600">Email</span>
              <br />
              <a
                href={`mailto:${site.email}`}
                className="text-[#d4c4a8] transition-colors hover:text-white"
              >
                {site.email}
              </a>
            </p>
            <p>
              <span className="text-zinc-600">Phone</span>
              <br />
              <a
                href={site.phoneTel}
                className="text-[#d4c4a8] transition-colors hover:text-white"
              >
                {site.phoneDisplay}
              </a>
            </p>
            <p className="text-zinc-500">
              {site.address.street}, {site.address.region}, {site.address.country}
            </p>
            <p className="text-zinc-600">
              Prefer a call? Mention it in your message and we&apos;ll coordinate.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
