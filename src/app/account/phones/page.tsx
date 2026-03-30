import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  addPhone,
  deletePhone,
  setDefaultPhone,
} from "@/app/actions/account";

export default async function PhonesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/phones");
  }

  const phones = await prisma.phoneNumber.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        {phones.length === 0 ? (
          <p className="text-sm text-zinc-500">No phone numbers saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {phones.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#121110]/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  {p.label ? (
                    <p className="text-xs uppercase tracking-wider text-[#a89968]">
                      {p.label}
                    </p>
                  ) : null}
                  <p className="mt-1 font-mono text-zinc-200">{p.number}</p>
                  {p.isDefault ? (
                    <span className="mt-2 inline-block rounded-full bg-[#a89968]/20 px-2 py-0.5 text-xs text-[#d4c4a8]">
                      Default
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!p.isDefault ? (
                    <form action={setDefaultPhone.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.05]"
                      >
                        Set default
                      </button>
                    </form>
                  ) : null}
                  <form action={deletePhone.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
        <h2 className="font-serif text-xl text-[#e8e4df]">Add phone</h2>
        <form action={addPhone} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-500">Label (optional)</span>
            <input
              name="label"
              placeholder="Mobile, Office…"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-500">Number *</span>
            <input
              required
              name="number"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input type="checkbox" name="isDefault" className="rounded border-white/20" />
            Set as default
          </label>
          <button
            type="submit"
            className="rounded-lg bg-[#a89968] px-6 py-2.5 text-sm font-semibold text-[#0c0b0a] hover:bg-[#bfb08a]"
          >
            Save phone
          </button>
        </form>
      </div>
    </div>
  );
}
