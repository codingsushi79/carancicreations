import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CreateInvoiceForm,
  type InvoicePrefill,
} from "@/components/dashboard/CreateInvoiceForm";
import { DashboardInvoiceCard } from "@/components/dashboard/DashboardInvoiceCard";

export const dynamic = "force-dynamic";

function money(cents: number, cur: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur || "USD",
  }).format(cents / 100);
}

function firstSearchParam(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default async function DashboardInvoicesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const inquiryIdFromQuery = firstSearchParam(sp.inquiryId);
  let prefill: InvoicePrefill | undefined;
  if (inquiryIdFromQuery) {
    const inq = await prisma.inquiry.findUnique({
      where: { id: inquiryIdFromQuery },
    });
    if (inq?.kind === "JOB") {
      const titleBase = inq.projectType?.trim() || "Job";
      const extras = [
        inq.eventDate ? `Date: ${inq.eventDate}` : null,
        inq.location ? `Location: ${inq.location}` : null,
        inq.budget ? `Budget: ${inq.budget}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      prefill = {
        inquiryId: inq.id,
        clientEmail: inq.email.trim().toLowerCase(),
        title: `${titleBase} — ${inq.name}`.slice(0, 200),
        description: [inq.message, extras].filter(Boolean).join("\n\n").slice(0, 8000),
      };
    }
  }

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 80,
    include: {
      client: { select: { email: true, name: true } },
      manager: { select: { email: true, name: true } },
      inquiry: { select: { id: true, name: true, kind: true } },
    },
  });

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
        <h2 className="font-serif text-xl text-[#e8e4df]">New invoice</h2>
        {prefill ? (
          <p className="mt-2 text-xs text-zinc-500">
            <Link href="/dashboard/invoices" className="text-[#a89968] hover:underline">
              Clear job prefill
            </Link>
          </p>
        ) : null}
        <div className="mt-6">
          <CreateInvoiceForm prefill={prefill} />
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-[#e8e4df]">Recent invoices</h2>
        <p className="mt-2 text-xs text-zinc-600">
          Voided invoices stay in this list (they are not deleted). Use status
          or Save to change them again.
        </p>
        <ul className="mt-4 space-y-3">
          {invoices.map((inv) => (
            <DashboardInvoiceCard
              key={inv.id}
              id={inv.id}
              status={inv.status}
              title={inv.title}
              amountDisplay={money(inv.amountCents, inv.currency)}
              clientDisplay={inv.client.name ?? inv.client.email ?? "—"}
              jobLabel={
                inv.inquiry?.kind === "JOB" ? inv.inquiry.name : null
              }
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
