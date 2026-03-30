"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function addAddress(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const label = String(formData.get("label") ?? "").trim() || null;
  const line1 = String(formData.get("line1") ?? "").trim();
  const line2 = String(formData.get("line2") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "US").trim() || "US";
  const isDefault = formData.get("isDefault") === "on";

  if (!line1 || !city || !region) return;

  await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    await tx.address.create({
      data: {
        userId,
        label,
        line1,
        line2,
        city,
        region,
        postalCode,
        country,
        isDefault,
      },
    });
  });

  revalidatePath("/account");
  revalidatePath("/account/addresses");
}

export async function deleteAddress(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.address.deleteMany({ where: { id, userId } });
  revalidatePath("/account/addresses");
}

export async function setDefaultAddress(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    await tx.address.updateMany({
      where: { id, userId },
      data: { isDefault: true },
    });
  });
  revalidatePath("/account/addresses");
}

export async function addPhone(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const label = String(formData.get("label") ?? "").trim() || null;
  const number = String(formData.get("number") ?? "").trim();
  const isDefault = formData.get("isDefault") === "on";
  if (!number) return;

  await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.phoneNumber.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    await tx.phoneNumber.create({
      data: { userId, label, number, isDefault },
    });
  });

  revalidatePath("/account/phones");
}

export async function deletePhone(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.phoneNumber.deleteMany({ where: { id, userId } });
  revalidatePath("/account/phones");
}

export async function setDefaultPhone(id: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.$transaction(async (tx) => {
    await tx.phoneNumber.updateMany({ where: { userId }, data: { isDefault: false } });
    await tx.phoneNumber.updateMany({
      where: { id, userId },
      data: { isDefault: true },
    });
  });
  revalidatePath("/account/phones");
}
