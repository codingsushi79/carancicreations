import { prisma } from "@/lib/prisma";

export default async function DashboardHomePage() {
  const [
    contactNew,
    jobNew,
    openInvoices,
    unpaidSent,
  ] = await Promise.all([
    prisma.inquiry.count({
      where: { kind: "CONTACT", status: "NEW" },
    }),
    prisma.inquiry.count({
      where: { kind: "JOB", status: "NEW" },
    }),
    prisma.invoice.count({
      where: { status: { in: ["DRAFT", "SENT"] } },
    }),
    prisma.invoice.count({ where: { status: "SENT" } }),
  ]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-white/[0.08] bg-[#121110]/50 p-5">
        <p className="text-3xl font-semibold text-[#d4c4a8]">{contactNew}</p>
        <p className="mt-1 text-sm text-zinc-500">New contact messages</p>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-[#121110]/50 p-5">
        <p className="text-3xl font-semibold text-[#d4c4a8]">{jobNew}</p>
        <p className="mt-1 text-sm text-zinc-500">New job requests</p>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-[#121110]/50 p-5">
        <p className="text-3xl font-semibold text-[#d4c4a8]">{openInvoices}</p>
        <p className="mt-1 text-sm text-zinc-500">Open invoices (draft + sent)</p>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-[#121110]/50 p-5">
        <p className="text-3xl font-semibold text-amber-200/90">{unpaidSent}</p>
        <p className="mt-1 text-sm text-zinc-500">Awaiting payment (sent)</p>
      </div>
    </div>
  );
}
