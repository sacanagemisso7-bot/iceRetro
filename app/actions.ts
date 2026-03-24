"use server";

import { prisma } from "@/lib/prisma";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export type LeadActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialLeadActionState: LeadActionState = {
  status: "idle",
  message: ""
};

export async function submitLeadAction(
  _previousState: LeadActionState,
  formData: FormData
): Promise<LeadActionState> {
  const name = value(formData, "name");
  const phone = value(formData, "phone");
  const favoriteFlavor = value(formData, "favoriteFlavor");
  const eventType = value(formData, "eventType");
  const eventDate = value(formData, "eventDate");
  const guestCount = value(formData, "guestCount");
  const city = value(formData, "city");
  const message = value(formData, "message");

  if (!name || !phone || !eventType || !message) {
    return {
      status: "error",
      message: "Preencha nome, WhatsApp, tipo de evento e uma mensagem curta para enviar."
    };
  }

  const leadMessage = [
    city ? `Cidade ou bairro: ${city}` : null,
    eventDate ? `Data desejada: ${eventDate}` : null,
    guestCount ? `Convidados estimados: ${guestCount}` : null,
    message
  ]
    .filter(Boolean)
    .join("\n");

  await prisma.lead.create({
    data: {
      name,
      phone,
      favoriteFlavor: favoriteFlavor || null,
      eventType: eventType || null,
      message: leadMessage
    }
  });

  return {
    status: "success",
    message: "Pedido recebido. Se quiser acelerar, chama a Ice Retro no WhatsApp agora mesmo."
  };
}
