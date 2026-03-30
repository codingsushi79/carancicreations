import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createPaypalOrderForInvoice } from "@/lib/paypal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { invoiceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const invoiceId = body.invoiceId;
  if (!invoiceId) {
    return NextResponse.json({ error: "invoiceId required" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice || invoice.clientId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (invoice.status !== "SENT") {
    return NextResponse.json({ error: "Invoice is not open for payment" }, { status: 400 });
  }

  const origin = new URL(req.url).origin;

  try {
    const { orderId, approveUrl } = await createPaypalOrderForInvoice({
      invoiceId: invoice.id,
      amountCents: invoice.amountCents,
      currency: invoice.currency,
      title: invoice.title,
      returnUrl: `${origin}/account/invoices/${invoice.id}?paypal=1`,
      cancelUrl: `${origin}/account/invoices/${invoice.id}?cancel=1`,
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { paypalOrderId: orderId },
    });

    return NextResponse.json({ approveUrl, orderId });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PayPal error" },
      { status: 500 },
    );
  }
}
