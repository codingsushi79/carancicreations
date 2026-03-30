import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CreateInvoiceForm,
  type InvoicePrefill,
} from "@/components/dashboard/CreateInvoiceForm";
import {
  markInvoicePaidManualForm,
  setInvoiceStatusForm,
} from "@/app/actions/dashboard";
import { InvoiceStatus } from "@/generated/prisma/enums";

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
        <ul className="mt-4 space-y-3">
          {invoices.map((inv) => (
            <li
              key={inv.id}
              className="rounded-xl border border-white/[0.08] bg-[#121110]/40 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-200">{inv.title}</p>
                  <p className="text-xs text-zinc-500">
                    Client: {inv.client.name ?? inv.client.email}
                  </p>
                  {inv.inquiry && inv.inquiry.kind === "JOB" ? (
                    <p className="mt-1 text-xs text-violet-300/80">
                      Linked job: {inv.inquiry.name}
                    </p>
                  ) : null}
                  <p className="text-xs text-zinc-600">{inv.id}</p>
                </div>
                <span className="text-lg text-[#d4c4a8]">
                  {money(inv.amountCents, inv.currency)}
                </span>
              </div>
              <form
                action={setInvoiceStatusForm}
                className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3"
              >
                <input type="hidden" name="id" value={inv.id} />
                <label className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span>Status</span>
                  <select
                    name="status"
                    defaultValue={inv.status}
                    className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-2 py-1.5 text-sm text-zinc-200"
                  >
                    <option value={InvoiceStatus.DRAFT}>Draft</option>
                    <option value={InvoiceStatus.SENT}>Sent</option>
                    <option value={InvoiceStatus.PAID}>Paid</option>
                    <option value={InvoiceStatus.CANCELLED}>Cancelled</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="rounded-lg border border-[#a89968]/35 px-3 py-1.5 text-xs font-medium text-[#d4c4a8] hover:bg-[#a89968]/10"
                >
                  Save status
                </button>
              </form>
              <div className="mt-2 flex flex-wrap gap-2">
                {inv.status === "DRAFT" ? (
                  <form action={setInvoiceStatusForm} className="inline">
                    <input type="hidden" name="id" value={inv.id} />
                    <input type="hidden" name="status" value={InvoiceStatus.SENT} />
                    <button
                      type="submit"
                      className="rounded-lg border border-amber-500/30 px-2 py-1 text-xs text-amber-200 hover:bg-amber-500/10"
                    >
                      Mark sent
                    </button>
                  </form>
                ) : null}
                {inv.status === "SENT" ? (
                  <form action={markInvoicePaidManualForm} className="inline">
                    <input type="hidden" name="id" value={inv.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-emerald-500/30 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/10"
                    >
                      Mark paid (manual)
                    </button>
                  </form>
                ) : null}
                {inv.status !== "CANCELLED" && inv.status !== "PAID" ? (
                  <form action={setInvoiceStatusForm} className="inline">
                    <input type="hidden" name="id" value={inv.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={InvoiceStatus.CANCELLED}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-zinc-600 px-2 py-1 text-xs text-zinc-400 hover:bg-white/[0.05]"
                    >
                      Cancel
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
