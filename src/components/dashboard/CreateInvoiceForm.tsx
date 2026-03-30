"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/app/actions/dashboard";

export type InvoicePrefill = {
  inquiryId: string;
  clientEmail: string;
  title: string;
  description: string;
};

export function CreateInvoiceForm({ prefill }: { prefill?: InvoicePrefill }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createInvoice(fd);
      if (res.ok) {
        setOk(true);
        e.currentTarget.reset();
        if (prefill?.inquiryId) {
          router.replace("/dashboard/invoices");
        }
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form
      key={prefill?.inquiryId ?? "new"}
      onSubmit={submit}
      className="space-y-4"
    >
      {prefill?.inquiryId ? (
        <>
          <input type="hidden" name="inquiryId" value={prefill.inquiryId} />
          <p className="rounded-lg border border-[#a89968]/25 bg-[#a89968]/10 px-3 py-2 text-sm text-[#d4c4a8]">
            Prefilled from job request. Client must still have signed in with
            Google using this email before you can create the invoice.
          </p>
        </>
      ) : null}
      <p className="text-sm text-zinc-500">
        Client must have signed in at least once with Google using the same
        email you enter below.
      </p>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-500">Client email *</span>
        <input
          required
          name="clientEmail"
          type="email"
          autoComplete="off"
          disabled={pending}
          defaultValue={prefill?.clientEmail ?? ""}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-500">Title *</span>
        <input
          required
          name="title"
          placeholder="e.g. Wedding photo package — deposit"
          disabled={pending}
          defaultValue={prefill?.title ?? ""}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-500">Description</span>
        <textarea
          name="description"
          rows={3}
          disabled={pending}
          defaultValue={prefill?.description ?? ""}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-500">Amount (USD) *</span>
        <input
          required
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="1500.00"
          disabled={pending}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-500">
          Manual PayPal link (optional)
        </span>
        <input
          name="manualPaypalUrl"
          type="url"
          placeholder="https://paypal.me/… or invoice link"
          disabled={pending}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 disabled:opacity-50"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-zinc-500">
          PayPal email shown to client (optional)
        </span>
        <input
          name="managerPaypalEmail"
          type="email"
          disabled={pending}
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-100 disabled:opacity-50"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" name="sendNow" defaultChecked className="rounded border-white/20" />
        Mark as sent (client can pay immediately)
      </label>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {ok ? (
        <p className="text-sm text-emerald-400/90">Invoice created.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#a89968] px-6 py-2.5 text-sm font-semibold text-[#0c0b0a] hover:bg-[#bfb08a] disabled:opacity-50"
      >
        {pending ? "Saving…" : "Create invoice"}
      </button>
    </form>
  );
}
