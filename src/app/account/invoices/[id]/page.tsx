import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InvoicePayButtons } from "@/components/account/InvoicePayButtons";

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(cents / 100);
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return null;

  const invoice = await prisma.invoice.findFirst({
    where: { id, clientId: session.user.id },
    include: { manager: { select: { name: true, email: true } } },
  });

  if (!invoice) notFound();

  const hostedCheckoutAvailable = !!(
    process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET
  );

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <Link
        href="/account/invoices"
        className="text-sm text-zinc-500 hover:text-zinc-300"
      >
        ← All invoices
      </Link>

      <div className="rounded-2xl border border-white/[0.1] bg-[#121110]/60 p-6 ring-1 ring-white/[0.04] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#a89968]">
              Invoice
            </p>
            <h1 className="mt-2 font-serif text-2xl text-[#f5f2ed]">
              {invoice.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Issued by {invoice.manager.name ?? invoice.manager.email}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              invoice.status === "PAID"
                ? "bg-emerald-500/20 text-emerald-200"
                : invoice.status === "SENT"
                  ? "bg-amber-500/20 text-amber-200"
                  : "bg-zinc-500/15 text-zinc-400"
            }`}
          >
            {invoice.status}
          </span>
        </div>

        <p className="mt-8 font-serif text-4xl text-[#d4c4a8]">
          {formatMoney(invoice.amountCents, invoice.currency)}
        </p>

        {invoice.description ? (
          <div className="mt-6 border-t border-white/[0.06] pt-6">
            <p className="text-sm leading-relaxed text-zinc-400">
              {invoice.description}
            </p>
          </div>
        ) : null}

        {invoice.status === "PAID" && invoice.paidAt ? (
          <p className="mt-6 text-sm text-emerald-400/90">
            Paid on {new Date(invoice.paidAt).toLocaleString()}
          </p>
        ) : null}

        {invoice.status === "SENT" ? (
          <div className="mt-8 border-t border-white/[0.06] pt-8">
            <p className="mb-4 text-sm text-zinc-500">Payment</p>
            <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
              <InvoicePayButtons
                invoiceId={invoice.id}
                status={invoice.status}
                manualPaypalUrl={invoice.manualPaypalUrl}
                hostedCheckoutAvailable={hostedCheckoutAvailable}
              />
            </Suspense>
            {invoice.managerPaypalEmail ? (
              <p className="mt-4 text-xs text-zinc-600">
                PayPal recipient: {invoice.managerPaypalEmail}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
