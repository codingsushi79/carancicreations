"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InquiryStatus, InvoiceStatus } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";

async function requireManager() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "MANAGER") {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
  internalNote?: string,
) {
  await requireManager();
  await prisma.inquiry.update({
    where: { id },
    data: {
      status,
      ...(internalNote !== undefined ? { internalNote } : {}),
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inquiries");
}

export async function updateInquiryFromForm(formData: FormData) {
  await requireManager();
  const id = String(formData.get("id") ?? "").trim();
  const raw = String(formData.get("status") ?? "").trim();
  if (!id || !raw) return;
  const status = raw as InquiryStatus;
  const allowed: InquiryStatus[] = [
    InquiryStatus.NEW,
    InquiryStatus.IN_PROGRESS,
    InquiryStatus.RESOLVED,
    InquiryStatus.ARCHIVED,
  ];
  if (!allowed.includes(status)) return;
  await prisma.inquiry.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inquiries");
}

export async function updateInquiryNoteForm(formData: FormData) {
  await requireManager();
  const id = String(formData.get("id") ?? "").trim();
  const internalNote = String(formData.get("internalNote") ?? "");
  if (!id) return;
  await prisma.inquiry.update({
    where: { id },
    data: { internalNote: internalNote || null },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inquiries");
}

export async function deleteInquiryForm(formData: FormData) {
  await requireManager();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/inquiries");
}

export async function createInvoice(formData: FormData) {
  const managerId = await requireManager();
  const clientEmail = String(formData.get("clientEmail") ?? "")
    .trim()
    .toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const amountDollars = String(formData.get("amount") ?? "").trim();
  const manualPaypalUrl =
    String(formData.get("manualPaypalUrl") ?? "").trim() || null;
  const managerPaypalEmail =
    String(formData.get("managerPaypalEmail") ?? "").trim() || null;
  const sendNow = formData.get("sendNow") === "on";
  const inquiryIdRaw = String(formData.get("inquiryId") ?? "").trim() || null;

  if (!clientEmail || !title) {
    return { ok: false as const, error: "Client email and title are required." };
  }

  let inquiryId: string | null = null;
  if (inquiryIdRaw) {
    const inq = await prisma.inquiry.findUnique({
      where: { id: inquiryIdRaw },
    });
    if (!inq) {
      return { ok: false as const, error: "Linked job request was not found." };
    }
    if (inq.kind !== "JOB") {
      return { ok: false as const, error: "Invoices can only be linked to job requests." };
    }
    if (inq.email.trim().toLowerCase() !== clientEmail) {
      return {
        ok: false as const,
        error: "Client email must match the job request email.",
      };
    }
    inquiryId = inq.id;
  }
  const amount = Number.parseFloat(amountDollars);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false as const, error: "Enter a valid amount in dollars." };
  }
  const amountCents = Math.round(amount * 100);

  const client = await prisma.user.findUnique({
    where: { email: clientEmail },
  });
  if (!client) {
    return {
      ok: false as const,
      error:
        "No account with that email. The client must sign in with Google at least once first.",
    };
  }

  const invoice = await prisma.invoice.create({
    data: {
      clientId: client.id,
      managerId,
      inquiryId,
      title,
      description,
      amountCents,
      status: sendNow ? InvoiceStatus.SENT : InvoiceStatus.DRAFT,
      manualPaypalUrl,
      managerPaypalEmail,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/account/invoices");
  return { ok: true as const, invoiceId: invoice.id };
}

export async function setInvoiceStatus(id: string, status: InvoiceStatus) {
  await requireManager();
  const inv = await prisma.invoice.findUnique({
    where: { id },
    select: { paidAt: true },
  });
  if (!inv) return;
  const data: { status: InvoiceStatus; paidAt?: Date | null } = { status };
  if (status === InvoiceStatus.PAID) {
    data.paidAt = inv.paidAt ?? new Date();
  } else if (inv.paidAt != null) {
    data.paidAt = null;
  }
  await prisma.invoice.update({ where: { id }, data });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/account/invoices");
  revalidatePath(`/account/invoices/${id}`);
}

export async function markInvoicePaidManual(id: string): Promise<void> {
  await requireManager();
  await prisma.invoice.update({
    where: { id },
    data: {
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/account/invoices");
  revalidatePath(`/account/invoices/${id}`);
}

export async function setInvoiceStatusForm(formData: FormData) {
  await requireManager();
  const id = String(formData.get("id") ?? "").trim();
  const raw = String(formData.get("status") ?? "").trim();
  if (!id || !raw) return;
  const status = raw as InvoiceStatus;
  const allowed: InvoiceStatus[] = [
    InvoiceStatus.DRAFT,
    InvoiceStatus.SENT,
    InvoiceStatus.PAID,
    InvoiceStatus.CANCELLED,
  ];
  if (!allowed.includes(status)) return;

  const inv = await prisma.invoice.findUnique({
    where: { id },
    select: { paidAt: true },
  });
  if (!inv) return;

  const data: { status: InvoiceStatus; paidAt?: Date | null } = { status };
  if (status === InvoiceStatus.PAID) {
    data.paidAt = inv.paidAt ?? new Date();
  } else if (inv.paidAt != null) {
    data.paidAt = null;
  }

  await prisma.invoice.update({ where: { id }, data });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invoices");
  revalidatePath("/account/invoices");
  revalidatePath(`/account/invoices/${id}`);
}

export async function markInvoicePaidManualForm(formData: FormData) {
  await requireManager();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await markInvoicePaidManual(id);
}
