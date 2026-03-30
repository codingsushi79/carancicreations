"use client";

import { useRef } from "react";
import { deleteInquiryForm } from "@/app/actions/dashboard";

export function DeleteInquiryForm({ id }: { id: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={deleteInquiryForm} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="button"
        onClick={() => {
          if (
            confirm(
              "Delete this request permanently? This cannot be undone. Invoices already created stay in the system.",
            )
          ) {
            formRef.current?.requestSubmit();
          }
        }}
        className="rounded-lg border border-red-500/35 px-3 py-1.5 text-xs text-red-300/95 hover:bg-red-500/10"
      >
        Delete
      </button>
    </form>
  );
}
