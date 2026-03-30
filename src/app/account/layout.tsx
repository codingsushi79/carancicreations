import Link from "next/link";
import { auth } from "@/auth";
import { AccountNav } from "@/components/account/AccountNav";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isManager = session?.user?.role === "MANAGER";

  return (
    <div className="flex flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#a89968]">
              Your account
            </p>
            <h1 className="mt-2 font-serif text-3xl text-[#f5f2ed] sm:text-4xl">
              Profile & billing
            </h1>
          </div>
          {isManager ? (
            <Link
              href="/dashboard"
              className="text-sm text-[#a89968] hover:underline"
            >
              Manager dashboard →
            </Link>
          ) : null}
        </div>
        <div className="mt-8">
          <AccountNav />
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
