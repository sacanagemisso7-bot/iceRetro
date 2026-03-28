"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitLeadAction } from "@/app/actions";
import { initialLeadActionState } from "@/app/lead-action-state";

type LeadFormProps = {
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

export function LeadForm({ whatsappHref }: LeadFormProps) {
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
        <h4 className="lead-form-title">Peça um orçamento rápido</h4>
        <p className="lead-form-copy">
          Conte o tipo de evento, a data estimada e o que você precisa. A Ice Retro responde
          pelo WhatsApp.
        </p>
      </div>

      <div className="lead-form-helper">
        <span className="lead-form-helper-title">Sem compromisso</span>
        <p className="lead-form-helper-copy">
          A resposta vai pelo WhatsApp com disponibilidade, formato e quantidade ideal para o seu
          evento.
        </p>
      </div>

      <div className="lead-form-grid">
        <label className="field lead-form-field">
          <span>Seu nome</span>
          <input name="name" placeholder="Ex.: Maria" required />
        </label>

        <label className="field lead-form-field">
          <span>WhatsApp</span>
          <input name="phone" placeholder="(42) 99999-9999" inputMode="tel" required />
        </label>
      </div>

      <label className="field lead-form-field lead-form-field-wide">
        <span>Tipo de evento</span>
        <select name="eventType" defaultValue="" required>
          <option value="" disabled>
            Selecione
          </option>
          <option value="Aniversário">Aniversário</option>
          <option value="Casamento">Casamento</option>
          <option value="Evento corporativo">Evento corporativo</option>
          <option value="Feira ou ação de marca">Feira ou ação de marca</option>
          <option value="Festa infantil">Festa infantil</option>
          <option value="Outro">Outro</option>
        </select>
      </label>

      <div className="lead-form-grid lead-form-grid-compact">
        <label className="field lead-form-field">
          <span>Data estimada</span>
          <input name="eventDate" type="date" />
        </label>

        <label className="field lead-form-field">
          <span>Convidados</span>
          <input name="guestCount" type="number" min="1" placeholder="80" />
        </label>
      </div>

      <div className="lead-form-grid lead-form-grid-single">
        <label className="field lead-form-field">
          <span>Cidade ou bairro</span>
          <input name="city" placeholder="Ponta Grossa" />
        </label>
      </div>

      <label className="field lead-form-field lead-form-field-message">
        <span>O que você imagina para o evento?</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Ex.: Quero atender 120 pessoas em um evento de empresa no sábado à tarde."
          required
        />
      </label>

      {state.status !== "idle" ? (
        <div className={`lead-form-feedback lead-form-feedback-${state.status}`}>
          <p>{state.message}</p>
          {state.status === "success" ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="lead-form-feedback-link"
            >
              Continuar no WhatsApp
            </a>
          ) : null}
        </div>
      ) : null}

      <LeadSubmitButton />
    </form>
  );
}
