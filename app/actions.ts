"use server";

import { prisma } from "@/lib/prisma";
import { hasUsableDatabase } from "@/lib/runtime-db";
import type { LeadActionState } from "@/app/lead-action-state";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

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

  if (!hasUsableDatabase()) {
    return {
      status: "error",
      message: "O formulario esta em modo demonstracao neste deploy. Chame no WhatsApp para continuar."
    };
  }

  try {
    await prisma.lead.create({
      data: {
        name,
        phone,
        favoriteFlavor: favoriteFlavor || null,
        eventType: eventType || null,
        message: leadMessage
      }
    });
  } catch (error) {
    console.error("[lead] Failed to persist lead", error);

    return {
      status: "error",
      message: "O formulario nao conseguiu salvar no ambiente atual. Chame no WhatsApp para continuar."
    };
  }

  return {
    status: "success",
    message: "Pedido recebido. Se quiser acelerar, chama a Ice Retro no WhatsApp agora mesmo."
  };
}
