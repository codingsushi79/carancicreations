import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/app/actions/account";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-sm text-zinc-500">No addresses saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#121110]/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  {a.label ? (
                    <p className="text-xs uppercase tracking-wider text-[#a89968]">
                      {a.label}
                    </p>
                  ) : null}
                  <p className="mt-1 text-zinc-200">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {a.city}, {a.region} {a.postalCode ?? ""} · {a.country}
                  </p>
                  {a.isDefault ? (
                    <span className="mt-2 inline-block rounded-full bg-[#a89968]/20 px-2 py-0.5 text-xs text-[#d4c4a8]">
                      Default
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!a.isDefault ? (
                    <form action={setDefaultAddress.bind(null, a.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.05]"
                      >
                        Set default
                      </button>
                    </form>
                  ) : null}
                  <form action={deleteAddress.bind(null, a.id)}>
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
        <h2 className="font-serif text-xl text-[#e8e4df]">Add address</h2>
        <form action={addAddress} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-500">Label (optional)</span>
            <input
              name="label"
              placeholder="Home, Studio…"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-500">Line 1 *</span>
            <input
              required
              name="line1"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-zinc-500">Line 2</span>
            <input
              name="line2"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-zinc-500">City *</span>
              <input
                required
                name="city"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-zinc-500">State / region *</span>
              <input
                required
                name="region"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-zinc-500">Postal code</span>
              <input
                name="postalCode"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-zinc-500">Country</span>
              <input
                name="country"
                defaultValue="US"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input type="checkbox" name="isDefault" className="rounded border-white/20" />
            Set as default address
          </label>
          <button
            type="submit"
            className="rounded-lg bg-[#a89968] px-6 py-2.5 text-sm font-semibold text-[#0c0b0a] hover:bg-[#bfb08a]"
          >
            Save address
          </button>
        </form>
      </div>
    </div>
  );
}
