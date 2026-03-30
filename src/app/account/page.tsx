import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccountOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const [addrCount, phoneCount, openInvoices] = await Promise.all([
    prisma.address.count({ where: { userId: session.user.id } }),
    prisma.phoneNumber.count({ where: { userId: session.user.id } }),
    prisma.invoice.count({
      where: {
        clientId: session.user.id,
        status: { in: ["SENT", "DRAFT"] },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
        <h2 className="font-serif text-xl text-[#e8e4df]">Signed in as</h2>
        <p className="mt-2 text-zinc-400">{session.user.email}</p>
        <p className="mt-1 text-sm text-zinc-600">
          Role:{" "}
          <span className="text-zinc-400">
            {session.user.role === "MANAGER" ? "Manager" : "Client"}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/account/addresses"
          className="rounded-xl border border-white/[0.08] bg-[#121110]/50 p-5 transition-colors hover:border-[#a89968]/30"
        >
          <p className="text-2xl font-semibold text-[#d4c4a8]">{addrCount}</p>
          <p className="mt-1 text-sm text-zinc-500">Saved addresses</p>
        </Link>
        <Link
          href="/account/phones"
          className="rounded-xl border border-white/[0.08] bg-[#121110]/50 p-5 transition-colors hover:border-[#a89968]/30"
        >
          <p className="text-2xl font-semibold text-[#d4c4a8]">{phoneCount}</p>
          <p className="mt-1 text-sm text-zinc-500">Phone numbers</p>
        </Link>
        <Link
          href="/account/invoices"
          className="rounded-xl border border-white/[0.08] bg-[#121110]/50 p-5 transition-colors hover:border-[#a89968]/30"
        >
          <p className="text-2xl font-semibold text-[#d4c4a8]">
            {openInvoices}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Open invoices</p>
        </Link>
      </div>

      {session.user.role === "MANAGER" ? (
        <div className="rounded-xl border border-[#a89968]/25 bg-[#a89968]/5 p-5">
          <p className="text-sm text-[#d4c4a8]">
            You have manager access. Open the dashboard to review inquiries,
            create invoices, and track payments.
          </p>
          <Link
            href="/dashboard"
            className="mt-3 inline-block text-sm font-medium text-white hover:underline"
          >
            Go to dashboard →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
