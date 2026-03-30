"use server";

import { prisma } from "@/lib/prisma";
import { InquiryKind } from "@/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export async function submitContactInquiry(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const projectType = String(formData.get("type") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !email || !message) {
    return { ok: false as const, error: "Please fill all required fields." };
  }
  await prisma.inquiry.create({
    data: {
      kind: InquiryKind.CONTACT,
      name,
      email,
      projectType: projectType || null,
      message,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/contact");
  return { ok: true as const };
}

export async function submitJobInquiry(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const projectType = String(formData.get("projectType") ?? "").trim() || null;
  const eventDate = String(formData.get("eventDate") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const budget = String(formData.get("budget") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !email || !message) {
    return { ok: false as const, error: "Please fill all required fields." };
  }
  await prisma.inquiry.create({
    data: {
      kind: InquiryKind.JOB,
      name,
      email,
      phone,
      projectType,
      eventDate,
      location,
      budget,
      message,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/request");
  return { ok: true as const };
}
