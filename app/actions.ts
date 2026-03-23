"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function submitLeadAction(formData: FormData) {
  const name = value(formData, "name");
  const phone = value(formData, "phone");
  const favoriteFlavor = value(formData, "favoriteFlavor");
  const eventType = value(formData, "eventType");
  const message = value(formData, "message");

  if (!name || !phone || !message) {
    redirect("/?lead=error#pedido");
  }

  await prisma.lead.create({
    data: {
      name,
      phone,
      favoriteFlavor: favoriteFlavor || null,
      eventType: eventType || null,
      message
    }
  });

  redirect("/?lead=success#pedido");
}
