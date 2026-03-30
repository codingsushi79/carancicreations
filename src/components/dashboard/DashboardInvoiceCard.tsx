"use client";

import {
  markInvoicePaidManual,
  setInvoiceStatus,
} from "@/app/actions/dashboard";
import { InvoiceStatus } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const STATUS_VALUES = Object.values(InvoiceStatus) as InvoiceStatus[];

function isInvoiceStatus(v: string): v is InvoiceStatus {
  return STATUS_VALUES.includes(v as InvoiceStatus);
}

type Props = {
  id: string;
  status: string;
  title: string;
  amountDisplay: string;
  clientDisplay: string;
  jobLabel: string | null;
};

export function DashboardInvoiceCard({
  id,
  status: initialStatus,
  title,
  amountDisplay,
  clientDisplay,
  jobLabel,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectStatus, setSelectStatus] = useState(initialStatus);

  useEffect(() => {
    setSelectStatus(initialStatus);
  }, [initialStatus]);

  async function runAction(fn: () => Promise<void>) {
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : "Could not update invoice.";
      setError(msg);
    }
  }

  function saveStatus() {
    if (!isInvoiceStatus(selectStatus)) {
      setError("Invalid status.");
      return;
    }
    startTransition(() =>
      runAction(() => setInvoiceStatus(id, selectStatus)),
    );
  }

  function quickSent() {
    startTransition(() =>
      runAction(() => setInvoiceStatus(id, InvoiceStatus.SENT)),
    );
  }

  function quickPaid() {
    startTransition(() => runAction(() => markInvoicePaidManual(id)));
  }

  function quickVoid() {
    startTransition(() =>
      runAction(() => setInvoiceStatus(id, InvoiceStatus.CANCELLED)),
    );
  }

  const isCancelled = initialStatus === "CANCELLED";
  const isPaid = initialStatus === "PAID";

  return (
    <li
      className={`rounded-xl border bg-[#121110]/40 p-4 ${
        isCancelled ? "border-zinc-500/30" : "border-white/[0.08]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-zinc-200">{title}</p>
          <p className="text-xs text-zinc-500">Client: {clientDisplay}</p>
          {jobLabel ? (
            <p className="mt-1 text-xs text-violet-300/80">
              Linked job: {jobLabel}
            </p>
          ) : null}
          <p className="text-xs text-zinc-600">{id}</p>
          {isCancelled ? (
            <p className="mt-2 text-xs text-zinc-500">
              Voided — still on record; not deleted.
            </p>
          ) : null}
        </div>
        <span className="text-lg text-[#d4c4a8]">{amountDisplay}</span>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
        <label className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span>Status</span>
          <select
            value={selectStatus}
            disabled={pending}
            onChange={(e) => setSelectStatus(e.target.value)}
            className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-2 py-1.5 text-sm text-zinc-200 disabled:opacity-50"
          >
            <option value={InvoiceStatus.DRAFT}>Draft</option>
            <option value={InvoiceStatus.SENT}>Sent</option>
            <option value={InvoiceStatus.PAID}>Paid</option>
            <option value={InvoiceStatus.CANCELLED}>Cancelled</option>
          </select>
        </label>
        <button
          type="button"
          disabled={pending || selectStatus === initialStatus}
          onClick={saveStatus}
          className="rounded-lg border border-[#a89968]/35 px-3 py-1.5 text-xs font-medium text-[#d4c4a8] hover:bg-[#a89968]/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save status
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {initialStatus === "DRAFT" ? (
          <button
            type="button"
            disabled={pending}
            onClick={quickSent}
            className="rounded-lg border border-amber-500/30 px-2 py-1 text-xs text-amber-200 hover:bg-amber-500/10 disabled:opacity-50"
          >
            Mark sent
          </button>
        ) : null}
        {initialStatus === "SENT" ? (
          <button
            type="button"
            disabled={pending}
            onClick={quickPaid}
            className="rounded-lg border border-emerald-500/30 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-50"
          >
            Mark paid (manual)
          </button>
        ) : null}
        {!isCancelled && !isPaid ? (
          <button
            type="button"
            disabled={pending}
            onClick={quickVoid}
            title="Keeps the invoice in your list with status Cancelled"
            className="rounded-lg border border-zinc-600 px-2 py-1 text-xs text-zinc-400 hover:bg-white/[0.05] disabled:opacity-50"
          >
            Void invoice
          </button>
        ) : null}
      </div>
    </li>
  );
}
