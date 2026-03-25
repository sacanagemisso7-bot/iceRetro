"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitLeadAction } from "@/app/actions";
import { initialLeadActionState } from "@/app/lead-action-state";

type FlavorOption = {
  id: string;
  name: string;
};

type LeadFormProps = {
  flavors: FlavorOption[];
  whatsappHref: string;
};

function LeadSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="site-primary-button lead-form-submit" disabled={pending}>
      {pending ? "Enviando pedido..." : "Enviar pedido de evento"}
    </button>
  );
}

export function LeadForm({ flavors, whatsappHref }: LeadFormProps) {
  const [state, formAction] = useActionState(submitLeadAction, initialLeadActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} id="pedido" action={formAction} className="lead-capture-form">
      <div className="lead-form-head">
        <p className="section-kicker">Eventos e festas</p>
        <h4 className="lead-form-title">Pede um orcamento rapido</h4>
        <p className="lead-form-copy">
          Conta o tipo de evento, data estimada e o que voce precisa. A Ice Retro responde pelo
          WhatsApp.
        </p>
      </div>

      <div className="lead-form-grid">
        <label className="field">
          <span>Seu nome</span>
          <input name="name" placeholder="Ex.: Maria" required />
        </label>

        <label className="field">
          <span>WhatsApp</span>
          <input name="phone" placeholder="(42) 99999-9999" inputMode="tel" required />
        </label>
      </div>

      <div className="lead-form-grid">
        <label className="field">
          <span>Tipo de evento</span>
          <select name="eventType" defaultValue="" required>
            <option value="" disabled>
              Selecione
            </option>
            <option value="Aniversario">Aniversario</option>
            <option value="Casamento">Casamento</option>
            <option value="Evento corporativo">Evento corporativo</option>
            <option value="Feira ou acao de marca">Feira ou acao de marca</option>
            <option value="Festa infantil">Festa infantil</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label className="field">
          <span>Sabor de interesse</span>
          <select name="favoriteFlavor" defaultValue="">
            <option value="">Sem preferencia</option>
            {flavors.map((flavor) => (
              <option key={flavor.id} value={flavor.name}>
                {flavor.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="lead-form-grid lead-form-grid-compact">
        <label className="field">
          <span>Data estimada</span>
          <input name="eventDate" type="date" />
        </label>

        <label className="field">
          <span>Convidados</span>
          <input name="guestCount" type="number" min="1" placeholder="80" />
        </label>

        <label className="field">
          <span>Cidade ou bairro</span>
          <input name="city" placeholder="Ponta Grossa" />
        </label>
      </div>

      <label className="field">
        <span>O que voce imagina para o evento?</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Ex.: Quero atender 120 pessoas em um evento de empresa no sabado a tarde."
          required
        />
      </label>

      {state.status !== "idle" ? (
        <div className={`lead-form-feedback lead-form-feedback-${state.status}`}>
          <p>{state.message}</p>
          {state.status === "success" ? (
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="lead-form-feedback-link">
              Continuar no WhatsApp
            </a>
          ) : null}
        </div>
      ) : null}

      <LeadSubmitButton />
    </form>
  );
}
