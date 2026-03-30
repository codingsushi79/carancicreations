"use client";

import { deleteInquiryById } from "@/app/actions/dashboard";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeleteInquiryForm({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      {error ? (
        <p className="max-w-[14rem] text-right text-xs text-red-400">{error}</p>
      ) : null}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          if (
            !confirm(
              "Delete this request permanently? This cannot be undone. Invoices already created stay in the system.",
            )
          ) {
            return;
          }
          startTransition(async () => {
            const res = await deleteInquiryById(id);
            if (!res.ok) {
              setError(res.error ?? "Delete failed.");
              return;
            }
            router.refresh();
          });
        }}
        className="rounded-lg border border-red-500/35 px-3 py-1.5 text-xs text-red-300/95 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
