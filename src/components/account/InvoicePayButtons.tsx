"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

type Props = {
  invoiceId: string;
  status: string;
  manualPaypalUrl: string | null;
  hostedCheckoutAvailable: boolean;
};

export function InvoicePayButtons({
  invoiceId,
  status,
  manualPaypalUrl,
  hostedCheckoutAvailable,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const paypalReturn = searchParams.get("paypal");
  const orderToken = searchParams.get("token");
  const captureAttempted = useRef(false);

  useEffect(() => {
    if (paypalReturn !== "1" || !orderToken || status !== "SENT") return;
    if (captureAttempted.current) return;
    captureAttempted.current = true;

    startTransition(async () => {
      try {
        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderToken, invoiceId }),
        });
        let data: { error?: string } = {};
        try {
          data = (await res.json()) as { error?: string };
        } catch {
          captureAttempted.current = false;
          setError("Could not read payment response. Try refreshing the page.");
          return;
        }
        if (!res.ok) {
          captureAttempted.current = false;
          setError(data.error ?? "Payment could not be completed.");
          return;
        }
        router.replace(`/account/invoices/${invoiceId}`);
        router.refresh();
      } catch {
        captureAttempted.current = false;
        setError("Something went wrong capturing payment.");
      }
    });
  }, [paypalReturn, orderToken, invoiceId, status, router]);

  if (status !== "SENT") return null;

  function startPaypal() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not start PayPal checkout.");
          return;
        }
        if (data.approveUrl) {
          window.location.href = data.approveUrl as string;
        } else {
          setError("No PayPal approval URL returned.");
        }
      } catch {
        setError("Could not connect to payment service.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {searchParams.get("cancel") === "1" ? (
        <p className="text-sm text-amber-200/90">Checkout was cancelled.</p>
      ) : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {hostedCheckoutAvailable ? (
        <button
          type="button"
          disabled={pending}
          onClick={startPaypal}
          className="w-full rounded-xl border border-[#0070ba]/40 bg-[#0070ba]/15 py-3 text-sm font-semibold text-[#7ec8ff] transition-colors hover:bg-[#0070ba]/25 disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {pending ? "Please wait…" : "Pay with PayPal"}
        </button>
      ) : null}
      {manualPaypalUrl ? (
        <a
          href={manualPaypalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-xl border border-white/[0.14] py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.06] sm:w-auto sm:px-8"
        >
          Open PayPal payment link
        </a>
      ) : null}
      {!hostedCheckoutAvailable && !manualPaypalUrl ? (
        <p className="text-sm text-zinc-500">
          Payment options will appear here when your invoice includes a PayPal
          link or when online checkout is enabled.
        </p>
      ) : null}
    </div>
  );
}
