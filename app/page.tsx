import { getSiteSnapshot } from "@/lib/cms";

export const dynamic = "force-dynamic";

const agenda = {
  0: { local: "Lago de Olarias", cidade: "Ponta Grossa PR", horario: "Domingo \u2022 15h as 20h" },
  1: { local: "Jardim Concei\u00e7\u00e3o", cidade: "Ponta Grossa PR", horario: "18h as 22h" },
  2: { local: "Jardim Concei\u00e7\u00e3o", cidade: "Ponta Grossa PR", horario: "18h as 22h" },
  3: { local: "Jardim Concei\u00e7\u00e3o", cidade: "Ponta Grossa PR", horario: "18h as 22h" },
  4: { local: "Jardim Concei\u00e7\u00e3o", cidade: "Ponta Grossa PR", horario: "18h as 22h" },
  5: { local: "Pra\u00e7a Santo Ant\u00f4nio", cidade: "Ponta Grossa PR", horario: "18h as 23h" },
  6: { local: "Evento / Sob consulta", cidade: "Ponta Grossa PR", horario: "Chama no WhatsApp" }
} as const;

const marqueeItems = [
  "0% LACTOSE",
  "100% SABOR",
  "ARTESANAL",
  "VEGANO",
  "NATURAL",
  "SEM GL\u00daTEN"
];

function normalizeWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

function normalizeInstagram(value: string) {
  const handle = value.replace(/^@/, "").trim();
  return `https://instagram.com/${handle}`;
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

export default async function HomePage() {
  const { site, flavors } = await getSiteSnapshot();

  const whatsappHref = normalizeWhatsApp(site.whatsappNumber);
  const instagramHref = normalizeInstagram(site.instagramHandle);
  const today = new Date().getDay() as keyof typeof agenda;
  const localAtual = agenda[today];
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${localAtual.local} ${localAtual.cidade}`
  )}&output=embed`;
  const marqueeText = `${marqueeItems.join(" \u2726 ")} \u2726 `;
  const stylePhotos = [
    { src: "/brand/cone-pink-poster.svg", alt: "Casquinha rosa na bancada da Ice Retro" },
    { src: "/brand/cone-vanilla-poster.svg", alt: "Casquinha clara ao entardecer na Ice Retro" },
    { src: "/public/brand/cone-pink-lavender.svg", alt: "Casquinha lilas em campo florido" },
    { src: "/brand/cone-pink-lavender-alt.svg", alt: "Casquinha lilas em outro registro florido" },
    { src: "/brand/cone-pink-park.svg", alt: "Casquinha rosa no parque" },
    { src: "/brand/cone-blue-carnival.svg", alt: "Casquinha azul em parque de diversoes" }
  ];

  return (
    <main className="retro-site" id="top">
      <header className="site-header">
        <div className="site-container site-nav">
          <a href="#top" className="site-logo-link" aria-label={site.brandName}>
            <img src="/brand/ice-retro-logo.svg" alt={site.brandName} className="site-logo-image" />
          </a>

          <nav className="site-nav-links" aria-label="Navegacao principal">
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
        <div className="site-container hero-content">
          <h1 className="hero-title">{site.heroTitle}</h1>
          <h2 className="hero-subtitle">{site.heroSubtitle}</h2>
          <p className="hero-copy">{site.heroDescription}</p>

          <div className="hero-cta-row">
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="site-primary-button">
              Pedir agora
            </a>

            <a href="#sabores" className="site-secondary-button">
              Ver sabores
            </a>
          </div>
        </div>
      </section>

      <section className="marquee-strip" aria-label="Qualidades da marca">
        <div className="marquee-track">
          <span>{marqueeText.repeat(4)}</span>
          <span>{marqueeText.repeat(4)}</span>
        </div>
      </section>

      <section id="sabores" className="site-section site-section-contrast">
        <div className="site-container site-section-inner">
          <h3 className="site-section-title">Nossos Sabores {"\u{1F366}"}</h3>

          <div className="flavor-grid">
            {flavors.map((flavor) => (
              <article key={flavor.id} className="flavor-card">
                {`${flavor.name} ${flavorEmoji(flavor.name)}`}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container site-section-inner">
          <h3 className="site-section-title">{site.experienceTitle} {"\u{1F4F8}"}</h3>

          <div className="style-grid">
            {stylePhotos.map((photo) => (
              <div key={photo.src} className="style-tile style-tile-image">
                <img src={photo.src} alt={photo.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="locais" className="site-section site-location-section">
        <div className="site-container site-section-inner">
          <h3 className="site-location-title">Onde estamos hoje {"\u{1F4CD}"}</h3>

          <p className="site-location-copy">
            Confira onde encontrar o Ice Retro hoje - cada dia um lugar diferente.
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
              <p>{"\u{1F4CD}"} {localAtual.local} - {localAtual.cidade}</p>
              <p>{"\u{23F0}"} {localAtual.horario}</p>
              <p>{"\u{1F366}"} Ice Retro hoje aqui</p>
            </div>
          </div>
        </div>
      </section>

      <section id="eventos" className="site-section site-section-contrast site-events">
        <div className="site-container site-section-inner site-events-inner">
          <h3 className="site-events-title">{site.storyTitle} {"\u{1F37E}"}</h3>
          <p className="site-events-copy">{site.storyBody}</p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="site-events-button"
          >
            Solicitar orcamento
          </a>
        </div>
      </section>

      <footer className="site-footer">{"\u00A9"} 2026 Ice Retro {"\u2022"} Sem lactose, com estilo</footer>
    </main>
  );
}
