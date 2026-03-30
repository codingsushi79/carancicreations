import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(cents / 100);
}

export default async function ClientInvoicesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const invoices = await prisma.invoice.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { manager: { select: { name: true, email: true } } },
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Invoices from the team appear here. Pay online when status is{" "}
        <span className="text-zinc-400">Sent</span>.
      </p>
      {invoices.length === 0 ? (
        <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center text-zinc-500">
          No invoices yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {invoices.map((inv) => (
            <li key={inv.id}>
              <Link
                href={`/account/invoices/${inv.id}`}
                className="flex flex-col gap-2 rounded-xl border border-white/[0.08] bg-[#121110]/40 p-4 transition-colors hover:border-[#a89968]/25 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-200">{inv.title}</p>
                  <p className="text-xs text-zinc-600">
                    From {inv.manager.name ?? inv.manager.email} ·{" "}
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-serif text-lg text-[#d4c4a8]">
                    {formatMoney(inv.amountCents, inv.currency)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : inv.status === "SENT"
                          ? "bg-amber-500/15 text-amber-200"
                          : inv.status === "CANCELLED"
                            ? "bg-zinc-500/15 text-zinc-400"
                            : "bg-zinc-500/10 text-zinc-500"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
