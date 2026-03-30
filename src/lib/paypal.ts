import "server-only";

function apiBase(): string {
  if (process.env.PAYPAL_API_BASE) return process.env.PAYPAL_API_BASE;
  return process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function paypalAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("PayPal API credentials are not configured.");
  }
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${t}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createPaypalOrderForInvoice(input: {
  invoiceId: string;
  amountCents: number;
  currency: string;
  title: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<{ orderId: string; approveUrl: string | undefined }> {
  const token = await paypalAccessToken();
  const value = (input.amountCents / 100).toFixed(2);
  const res = await fetch(`${apiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.invoiceId,
          description: input.title.slice(0, 127),
          amount: {
            currency_code: input.currency,
            value,
          },
        },
      ],
      application_context: {
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
        brand_name: "blankcreations",
        user_action: "PAY_NOW",
      },
    }),
  });
  const data = (await res.json()) as {
    id?: string;
    links?: { rel: string; href: string }[];
  };
  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  const approveUrl = data.links?.find((l) => l.rel === "approve")?.href;
  return { orderId: data.id ?? "", approveUrl };
}

export async function capturePaypalOrder(
  orderId: string,
): Promise<{ ok: boolean; captureId?: string; raw: unknown }> {
  const token = await paypalAccessToken();
  const res = await fetch(`${apiBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const raw = await res.json();
  if (!res.ok) {
    return { ok: false, raw };
  }
  const purchase = (raw as { purchase_units?: { payments?: { captures?: { id: string }[] } }[] })
    .purchase_units?.[0];
  const captureId = purchase?.payments?.captures?.[0]?.id;
  return { ok: true, captureId, raw };
}
