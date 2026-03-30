import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
              Manager
            </p>
            <h1 className="mt-2 font-serif text-3xl text-[#f5f2ed] sm:text-4xl">
              Team dashboard
            </h1>
          </div>
          <Link
            href="/account"
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            ← Your account
          </Link>
        </div>
        <div className="mt-8">
          <DashboardNav />
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
