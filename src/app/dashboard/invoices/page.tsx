import { prisma } from "@/lib/prisma";
import { CreateInvoiceForm } from "@/components/dashboard/CreateInvoiceForm";
import {
  markInvoicePaidManualForm,
  setInvoiceStatusForm,
} from "@/app/actions/dashboard";
import { InvoiceStatus } from "@/generated/prisma/enums";

function money(cents: number, cur: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur || "USD",
  }).format(cents / 100);
}

export default async function DashboardInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 80,
    include: {
      client: { select: { email: true, name: true } },
      manager: { select: { email: true, name: true } },
    },
  });

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
        <h2 className="font-serif text-xl text-[#e8e4df]">New invoice</h2>
        <div className="mt-6">
          <CreateInvoiceForm />
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
                  <p className="text-xs text-zinc-600">{inv.id}</p>
                </div>
                <span className="text-lg text-[#d4c4a8]">
                  {money(inv.amountCents, inv.currency)}
                </span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-wider text-zinc-500">
                {inv.status}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {inv.status === "DRAFT" ? (
                  <form action={setInvoiceStatusForm}>
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
                  <form action={markInvoicePaidManualForm}>
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
                  <form action={setInvoiceStatusForm}>
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
