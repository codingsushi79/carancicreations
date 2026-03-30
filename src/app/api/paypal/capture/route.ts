import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { capturePaypalOrder } from "@/lib/paypal";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { orderId?: string; invoiceId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { orderId, invoiceId } = body;
  if (!orderId || !invoiceId) {
    return NextResponse.json({ error: "orderId and invoiceId required" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice || invoice.clientId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (invoice.paypalOrderId && invoice.paypalOrderId !== orderId) {
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
  }

  const result = await capturePaypalOrder(orderId);
  if (!result.ok) {
    return NextResponse.json({ error: "Capture failed", detail: result.raw }, { status: 400 });
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "PAID",
      paypalCaptureId: result.captureId ?? null,
      paidAt: new Date(),
    },
  });

  revalidatePath("/account/invoices");
  revalidatePath(`/account/invoices/${invoiceId}`);
  revalidatePath("/dashboard/invoices");
  revalidatePath("/dashboard");

  return NextResponse.json({ ok: true });
}
