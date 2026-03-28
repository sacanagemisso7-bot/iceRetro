import { getSiteSnapshot } from "@/lib/cms";
import { LeadForm } from "@/components/site/lead-form";
import { StyleGallery } from "@/components/site/style-gallery";

export const dynamic = "force-dynamic";

const marqueeItems = [
  "0% LACTOSE",
  "100% SABOR",
  "ARTESANAL",
  "VEGANO",
  "NATURAL",
  "SEM GL\u00daTEN"
];

const sundayLocationQuery = "Lago de Olarias, Ponta Grossa - PR";

function normalizeWhatsApp(value: string) {
  const digits = "5542998056264";
  return `https://wa.me/${digits}`;
}

function normalizeInstagram(value: string) {
  const handle = value.replace(/^@/, "").trim();
  return "https://www.instagram.com/sorvetesiceretro/";
}

function isSundayInBrazil() {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "America/Sao_Paulo"
  }).format(new Date());

  return weekday === "Sun";
}

function resolveLocation(value: string) {
  if (isSundayInBrazil()) {
    return {
      query: sundayLocationQuery,
      title: sundayLocationQuery,
      subtitle: "Localiza\u00e7\u00e3o autom\u00e1tica de domingo"
    };
  }

  const trimmed = value.trim();

  if (!trimmed || /atendimento online|sob consulta/i.test(trimmed)) {
    return {
      query: "-25.079928, -50.128051",
      title: "Ponto configurado no mapa",
      subtitle: "Localiza\u00e7\u00e3o fixada por coordenadas"
    };
  }

  return {
    query: trimmed,
    title: trimmed,
    subtitle: "Endere\u00e7o configurado"
  };
}

function flavorEmoji(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("morango")) return "\u{1F353}";
  if (normalized.includes("uva")) return "\u{1F347}";
  if (normalized.includes("lim")) return "\u{1F34B}";
  if (normalized.includes("abacaxi")) return "\u{1F34D}";
  if (normalized.includes("chiclete")) return "\u{1F36C}";
  if (normalized.includes("melancia")) return "\u{1F349}";
  if (normalized.includes("pistache")) return "\u{1F49A}";
  if (normalized.includes("vinho")) return "\u{1F377}";
  if (normalized.includes("menta")) return "\u{1F33F}";
  if (normalized.includes("cereja")) return "\u{1F352}";
  if (normalized.includes("milho")) return "\u{1F33D}";
  if (normalized.includes("ice blue")) return "\u{2744}\u{FE0F}";
  return "\u{1F366}";
}

function formatFlavorName(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized === "limao") {
    return "Lim\u00e3o";
  }

  return name;
}

export default async function HomePage() {
  const { site, flavors } = await getSiteSnapshot();

  const whatsappHref = normalizeWhatsApp(site.whatsappNumber);
  const instagramHref = normalizeInstagram(site.instagramHandle);
  const mapLocation = resolveLocation(site.addressLine);
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapLocation.query)}&output=embed`;
  const mapaHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation.query)}`;
  const marqueeText = `${marqueeItems.join(" \u2726 ")} \u2726 `;
  const stylePhotos = [
    {
      src: "/brand/cone-pink-contrast.png",
      alt: "Casquinha rosa na bancada da Ice Retro",
      kicker: "Assinatura",
      title: "Cor forte e presen\u00e7a de marca",
      description: "O rosa da Ice Retro aparece com contraste alto e cara de campanha.",
      tone: "pink",
      featured: true
    },
    {
      src: "/brand/cone-vanilla-soft.png",
      alt: "Casquinha clara ao entardecer na Ice Retro",
      kicker: "Textura",
      title: "Leveza no clique",
      description: "Luz mais suave para destacar creme, acabamento e detalhe do produto.",
      tone: "gold"
    },
    {
      src: "/brand/cone-pink-lavender.png",
      alt: "Casquinha lil\u00e1s em campo florido",
      kicker: "Mood",
      title: "Retr\u00f4, doce e memor\u00e1vel",
      description: "Um visual divertido que combina produto, cor e atmosfera.",
      tone: "lilac"
    },
    {
      src: "/brand/cone-purple-flower.png",
      alt: "Casquinha lil\u00e1s em outro registro florido",
      kicker: "Campanha",
      title: "Identidade consistente",
      description: "A est\u00e9tica continua reconhec\u00edvel mesmo mudando o enquadramento.",
      tone: "berry"
    },
    {
      src: "/brand/cone-pink-event.png",
      alt: "Casquinha rosa no parque",
      kicker: "Rua",
      title: "Marca em movimento",
      description: "O sorvete funciona bem no feed, na rua e em material de evento.",
      tone: "mint"
    },
    {
      src: "/brand/cone-blue-carnival.jpeg",
      alt: "Casquinha azul em parque de divers\u00f5es",
      kicker: "Impacto",
      title: "Paleta viva sem perder eleg\u00e2ncia",
      description: "Cores diferentes entram para ampliar o repert\u00f3rio visual da marca.",
      tone: "blue"
    }
  ];
  const eventHighlights = [
    "Atendimento para festas, empresas e a\u00e7\u00f5es especiais.",
    "Marca forte, visual bonito e opera\u00e7\u00e3o pensada para foto e experi\u00eancia.",
    "Resposta r\u00e1pida para alinhar formato, quantidade e data."
  ];

  return (
    <main className="retro-site" id="top">
      <header className="site-header">
        <div className="site-container site-nav">
          <a href="#top" className="site-logo-link" aria-label={site.brandName}>
            <img src="/brand/ice-retro-logo.svg" alt={site.brandName} className="site-logo-image" />
          </a>

          <nav className="site-nav-links" aria-label="Navega\u00e7\u00e3o principal">
            <a href="#sabores">Sabores</a>
            <a href="#locais">Locais</a>
            <a href="#eventos">Eventos</a>
          </nav>

          <a
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            className="site-instagram-button"
          >
            Instagram
          </a>
        </div>
      </header>

      <section className="site-hero">
        <img
          src="/brand/ice-retro-logo.svg"
          alt=""
          aria-hidden="true"
          className="hero-background-logo"
        />

        <div className="site-container hero-content">
          <h1 className="hero-title">{site.heroTitle}</h1>
          <h2 className="hero-subtitle">{site.heroSubtitle}</h2>
          <p className="hero-copy">{site.heroDescription}</p>

          <div className="hero-cta-row">
            <a href="#sabores" className="site-secondary-button">
              Ver sabores
            </a>
          </div>
        </div>

        <div className="marquee-strip hero-marquee-strip" aria-label="Qualidades da marca">
          <div className="marquee-track">
            <span>{marqueeText.repeat(4)}</span>
            <span>{marqueeText.repeat(4)}</span>
          </div>
        </div>
      </section>

      <section id="sabores" className="site-section site-section-contrast">
        <div className="site-container site-section-inner">
          <h3 className="site-section-title">Nossos Sabores {"\u{1F366}"}</h3>

          <div className="flavor-grid">
            {flavors.map((flavor) => {
              const displayName = formatFlavorName(flavor.name);

              return (
                <article key={flavor.id} className="flavor-card">
                  {`${displayName} ${flavorEmoji(displayName)}`}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="locais" className="site-section site-location-section">
        <div className="site-container site-section-inner">
          <p className="section-kicker">Mapa do ponto atual</p>
          <h3 className="site-location-title">Onde estamos {"\u{1F4CD}"}</h3>

          <p className="site-location-copy">
            Confira o local configurado no mapa. Se precisar confirmar antes de sair, chama no
            WhatsApp.
          </p>

          <div className="location-card">
            <iframe
              title="Mapa Ice Retro"
              src={mapaSrc}
              className="location-map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="location-info">
              <span className="location-badge">Ponto atual Ice Retro</span>
              <h4 className="location-place">{mapLocation.title}</h4>
              <p className="location-city">{mapLocation.subtitle}</p>

              <div className="location-meta">
                <div className="location-meta-card">
                  <span>Hor\u00e1rio</span>
                  <strong>{site.serviceHours}</strong>
                </div>

                <div className="location-meta-card">
                  <span>Atendimento</span>
                  <strong>{site.deliveryZones}</strong>
                </div>
              </div>

              <a
                href={mapaHref}
                target="_blank"
                rel="noreferrer"
                className="site-secondary-button location-button"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="eventos" className="site-section site-section-contrast site-events">
        <div className="site-container site-events-layout">
          <div className="site-events-content">
            <p className="section-kicker">Ice Retro no seu evento</p>
            <h3 className="site-events-title">{site.storyTitle} {"\u{1F37E}"}</h3>
            <p className="site-events-copy">{site.storyBody}</p>

            <div className="site-events-points">
              {eventHighlights.map((item) => (
                <p key={item} className="site-events-point">
                  <span>+</span>
                  {item}
                </p>
              ))}
            </div>

            <div className="site-events-actions">
              <a href="#pedido" className="site-events-button">
                Preencher formul\u00e1rio
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="site-secondary-button site-events-whatsapp"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <LeadForm whatsappHref={whatsappHref} />
        </div>
      </section>

      <section id="estilo" className="site-section site-style-section">
        <div className="site-container site-section-inner">
          <p className="section-kicker">Est\u00e9tica Ice Retro</p>
          <h3 className="site-section-title">{site.experienceTitle} {"\u{1F4F8}"}</h3>
          <p className="style-section-copy">{site.experienceDescription}</p>

          <StyleGallery photos={stylePhotos} />
        </div>
      </section>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp-button"
        aria-label="Abrir WhatsApp da Ice Retro"
      >
        <span className="floating-whatsapp-ping" aria-hidden="true" />
        <span className="floating-whatsapp-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" className="floating-whatsapp-svg">
            <circle cx="16" cy="16" r="16" fill="#128C7E" />
            <path
              fill="#FFFFFF"
              d="M16 6.2c-5.4 0-9.8 4.1-9.8 9.3 0 1.9.6 3.6 1.7 5.1l-1.4 4.8 5-1.3c1.3.7 2.9 1.1 4.5 1.1 5.4 0 9.8-4.1 9.8-9.3S21.4 6.2 16 6.2Zm0 17c-1.4 0-2.8-.4-4-1l-.3-.2-2.9.8.8-2.8-.2-.3c-.9-1.2-1.4-2.7-1.4-4.2 0-4.1 3.6-7.5 8-7.5s8 3.4 8 7.5-3.6 7.5-8 7.5Z"
            />
            <path
              fill="#FFFFFF"
              d="M20.8 18.2c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.8-1.6-1.8-1.8-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.4-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.3 5.2 4.6 2.5 1.1 3.1.8 3.7.8.6-.1 1.8-.7 2-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4Z"
            />
          </svg>
        </span>
        <span className="floating-whatsapp-copy">
          <strong>Chama no WhatsApp</strong>
          <small>Pedido r\u00e1pido e eventos</small>
        </span>
      </a>

      <footer className="site-footer">
        {"\u00A9"} 2026 Ice Retro {"\u2022"} Sem lactose, com estilo
      </footer>
    </main>
  );
}
