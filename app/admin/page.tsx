import Link from "next/link";
import { LeadStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  createFlavorAction,
  createHighlightAction,
  createTestimonialAction,
  deleteFlavorAction,
  deleteHighlightAction,
  deleteTestimonialAction,
  logoutAction,
  updateFlavorAction,
  updateHighlightAction,
  updateLeadStatusAction,
  updateSiteAction,
  updateTestimonialAction
} from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { getDashboardSnapshot } from "@/lib/cms";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(value);
}

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { site, highlights, flavors, testimonials, leads } = await getDashboardSnapshot();
  const featuredCount = flavors.filter((item) => item.featured).length;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <span className="admin-chip">Ice Retro</span>
          <h1>CMS completo</h1>
          <p>Gerencie narrativa, cardapio, prova social e oportunidades comerciais em um so lugar.</p>
        </div>

        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/">Ver site</Link>
          <Link href="/api/site">API publica</Link>
        </nav>

        <div className="admin-session">
          <span>Logado como</span>
          <strong>{session.email}</strong>
        </div>

        <form action={logoutAction}>
          <button type="submit" className="ghost-button full-width">
            Sair do painel
          </button>
        </form>
      </aside>

      <section className="admin-content">
        <div className="admin-stack">
          <section className="admin-hero-card">
            <div>
              <span className="kicker">Painel operacional</span>
              <h2>Site, cardapio e captacao na mesma esteira.</h2>
              <p>
                Tudo abaixo alimenta a home da Ice Retro em tempo real e deixa a equipe livre para operar campanha,
                delivery e eventos.
              </p>
            </div>
            <div className="stat-grid">
              <article className="stat-card">
                <span>Sabores</span>
                <strong>{flavors.length}</strong>
              </article>
              <article className="stat-card">
                <span>Destaques</span>
                <strong>{highlights.length}</strong>
              </article>
              <article className="stat-card">
                <span>Assinaturas em foco</span>
                <strong>{featuredCount}</strong>
              </article>
              <article className="stat-card">
                <span>Leads recebidos</span>
                <strong>{leads.length}</strong>
              </article>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <span className="kicker">Conteudo base</span>
                <h3>Textos principais da home</h3>
              </div>
            </div>

            <form action={updateSiteAction} className="admin-form">
              <input type="hidden" name="id" value={site.id} />

              <div className="form-grid">
                <label className="field">
                  <span>Nome da marca</span>
                  <input name="brandName" defaultValue={site.brandName} required />
                </label>
                <label className="field">
                  <span>Eyebrow</span>
                  <input name="heroEyebrow" defaultValue={site.heroEyebrow} required />
                </label>
              </div>

              <label className="field">
                <span>Titulo principal</span>
                <input name="heroTitle" defaultValue={site.heroTitle} required />
              </label>

              <div className="form-grid">
                <label className="field">
                  <span>Subtitulo</span>
                  <textarea name="heroSubtitle" rows={3} defaultValue={site.heroSubtitle} required />
                </label>
                <label className="field">
                  <span>Descricao</span>
                  <textarea name="heroDescription" rows={3} defaultValue={site.heroDescription} required />
                </label>
              </div>

              <label className="field">
                <span>Announcement</span>
                <input name="announcement" defaultValue={site.announcement} required />
              </label>

              <div className="form-grid">
                <label className="field">
                  <span>CTA primario</span>
                  <input name="primaryCtaLabel" defaultValue={site.primaryCtaLabel} required />
                </label>
                <label className="field">
                  <span>Href primario</span>
                  <input name="primaryCtaHref" defaultValue={site.primaryCtaHref} required />
                </label>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>CTA secundario</span>
                  <input name="secondaryCtaLabel" defaultValue={site.secondaryCtaLabel} required />
                </label>
                <label className="field">
                  <span>Href secundario</span>
                  <input name="secondaryCtaHref" defaultValue={site.secondaryCtaHref} required />
                </label>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Titulo experiencia</span>
                  <textarea name="experienceTitle" rows={3} defaultValue={site.experienceTitle} required />
                </label>
                <label className="field">
                  <span>Descricao experiencia</span>
                  <textarea
                    name="experienceDescription"
                    rows={3}
                    defaultValue={site.experienceDescription}
                    required
                  />
                </label>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Titulo da historia</span>
                  <input name="storyTitle" defaultValue={site.storyTitle} required />
                </label>
                <label className="field">
                  <span>Historia da marca</span>
                  <textarea name="storyBody" rows={4} defaultValue={site.storyBody} required />
                </label>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Telefone</span>
                  <input name="contactPhone" defaultValue={site.contactPhone} required />
                </label>
                <label className="field">
                  <span>WhatsApp</span>
                  <input name="whatsappNumber" defaultValue={site.whatsappNumber} required />
                </label>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Instagram</span>
                  <input name="instagramHandle" defaultValue={site.instagramHandle} required />
                </label>
                <label className="field">
                  <span>Endereco</span>
                  <input name="addressLine" defaultValue={site.addressLine} required />
                </label>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Horario</span>
                  <input name="serviceHours" defaultValue={site.serviceHours} required />
                </label>
                <label className="field">
                  <span>Areas atendidas</span>
                  <textarea name="deliveryZones" rows={3} defaultValue={site.deliveryZones} required />
                </label>
              </div>

              <SubmitButton>Salvar home</SubmitButton>
            </form>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <span className="kicker">Destaques</span>
                <h3>Blocos que sustentam a proposta da home</h3>
              </div>
            </div>

            <div className="admin-list">
              {highlights.map((item) => (
                <article key={item.id} className="list-card">
                  <form action={updateHighlightAction} className="admin-form">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="form-grid">
                      <label className="field">
                        <span>Kicker</span>
                        <input name="kicker" defaultValue={item.kicker} required />
                      </label>
                      <label className="field">
                        <span>Tone</span>
                        <select name="tone" defaultValue={item.tone}>
                          <option value="pink">Pink</option>
                          <option value="mint">Mint</option>
                          <option value="butter">Butter</option>
                          <option value="cream">Cream</option>
                        </select>
                      </label>
                    </div>

                    <label className="field">
                      <span>Titulo</span>
                      <input name="title" defaultValue={item.title} required />
                    </label>

                    <label className="field">
                      <span>Descricao</span>
                      <textarea name="description" rows={3} defaultValue={item.description} required />
                    </label>

                    <div className="form-grid">
                      <label className="field">
                        <span>CTA label</span>
                        <input name="ctaLabel" defaultValue={item.ctaLabel || ""} />
                      </label>
                      <label className="field">
                        <span>CTA href</span>
                        <input name="ctaHref" defaultValue={item.ctaHref || ""} />
                      </label>
                    </div>

                    <label className="field compact-field">
                      <span>Ordem</span>
                      <input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                    </label>

                    <div className="admin-actions-row">
                      <SubmitButton>Salvar destaque</SubmitButton>
                    </div>
                  </form>

                  <form action={deleteHighlightAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="danger-button">
                      Remover
                    </button>
                  </form>
                </article>
              ))}
            </div>

            <form action={createHighlightAction} className="admin-form admin-form-divider">
              <h4>Novo destaque</h4>
              <div className="form-grid">
                <label className="field">
                  <span>Kicker</span>
                  <input name="kicker" placeholder="Novo destaque" required />
                </label>
                <label className="field">
                  <span>Tone</span>
                  <select name="tone" defaultValue="cream">
                    <option value="cream">Cream</option>
                    <option value="pink">Pink</option>
                    <option value="mint">Mint</option>
                    <option value="butter">Butter</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Titulo</span>
                <input name="title" required />
              </label>
              <label className="field">
                <span>Descricao</span>
                <textarea name="description" rows={3} required />
              </label>
              <div className="form-grid">
                <label className="field">
                  <span>CTA label</span>
                  <input name="ctaLabel" />
                </label>
                <label className="field">
                  <span>CTA href</span>
                  <input name="ctaHref" placeholder="#pedido" />
                </label>
              </div>
              <label className="field compact-field">
                <span>Ordem</span>
                <input name="sortOrder" type="number" defaultValue={highlights.length + 1} />
              </label>
              <SubmitButton>Criar destaque</SubmitButton>
            </form>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <span className="kicker">Cardapio</span>
                <h3>Sabores, categorias e itens em destaque</h3>
              </div>
            </div>

            <div className="admin-list">
              {flavors.map((item) => (
                <article key={item.id} className="list-card">
                  <form action={updateFlavorAction} className="admin-form">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="form-grid">
                      <label className="field">
                        <span>Categoria</span>
                        <input name="category" defaultValue={item.category} required />
                      </label>
                      <label className="field">
                        <span>Nome</span>
                        <input name="name" defaultValue={item.name} required />
                      </label>
                    </div>

                    <label className="field">
                      <span>Descricao</span>
                      <textarea name="description" rows={3} defaultValue={item.description} required />
                    </label>

                    <div className="form-grid">
                      <label className="field">
                        <span>Preco</span>
                        <input name="price" defaultValue={item.price} required />
                      </label>
                      <label className="field">
                        <span>Badge</span>
                        <input name="badge" defaultValue={item.badge || ""} />
                      </label>
                    </div>

                    <div className="form-grid">
                      <label className="field">
                        <span>Cor de destaque</span>
                        <input name="accentColor" type="color" defaultValue={item.accentColor} required />
                      </label>
                      <label className="field">
                        <span>Intensidade</span>
                        <input name="intensity" type="number" min="1" max="5" defaultValue={item.intensity} />
                      </label>
                    </div>

                    <div className="form-grid">
                      <label className="field compact-field">
                        <span>Ordem</span>
                        <input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                      </label>
                      <label className="checkbox-field">
                        <input name="featured" type="checkbox" defaultChecked={item.featured} />
                        <span>Exibir em destaque</span>
                      </label>
                    </div>

                    <div className="admin-actions-row">
                      <SubmitButton>Salvar sabor</SubmitButton>
                    </div>
                  </form>

                  <form action={deleteFlavorAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="danger-button">
                      Remover
                    </button>
                  </form>
                </article>
              ))}
            </div>

            <form action={createFlavorAction} className="admin-form admin-form-divider">
              <h4>Novo sabor</h4>
              <div className="form-grid">
                <label className="field">
                  <span>Categoria</span>
                  <input name="category" placeholder="Milk-Shake" required />
                </label>
                <label className="field">
                  <span>Nome</span>
                  <input name="name" placeholder="Nome do produto" required />
                </label>
              </div>
              <label className="field">
                <span>Descricao</span>
                <textarea name="description" rows={3} required />
              </label>
              <div className="form-grid">
                <label className="field">
                  <span>Preco</span>
                  <input name="price" placeholder="R$ 24" required />
                </label>
                <label className="field">
                  <span>Badge</span>
                  <input name="badge" placeholder="Signature" />
                </label>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>Cor</span>
                  <input name="accentColor" type="color" defaultValue="#ff6f61" required />
                </label>
                <label className="field">
                  <span>Intensidade</span>
                  <input name="intensity" type="number" min="1" max="5" defaultValue={3} />
                </label>
              </div>
              <div className="form-grid">
                <label className="field compact-field">
                  <span>Ordem</span>
                  <input name="sortOrder" type="number" defaultValue={flavors.length + 1} />
                </label>
                <label className="checkbox-field">
                  <input name="featured" type="checkbox" />
                  <span>Exibir em destaque</span>
                </label>
              </div>
              <SubmitButton>Criar sabor</SubmitButton>
            </form>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <span className="kicker">Depoimentos</span>
                <h3>Social proof para campanha e home</h3>
              </div>
            </div>

            <div className="admin-list">
              {testimonials.map((item) => (
                <article key={item.id} className="list-card">
                  <form action={updateTestimonialAction} className="admin-form">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="form-grid">
                      <label className="field">
                        <span>Autor</span>
                        <input name="author" defaultValue={item.author} required />
                      </label>
                      <label className="field">
                        <span>Cargo</span>
                        <input name="role" defaultValue={item.role} required />
                      </label>
                    </div>
                    <label className="field">
                      <span>Depoimento</span>
                      <textarea name="quote" rows={4} defaultValue={item.quote} required />
                    </label>
                    <div className="form-grid">
                      <label className="field compact-field">
                        <span>Nota</span>
                        <input name="rating" type="number" min="1" max="5" defaultValue={item.rating} />
                      </label>
                      <label className="field compact-field">
                        <span>Ordem</span>
                        <input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                      </label>
                    </div>
                    <div className="admin-actions-row">
                      <SubmitButton>Salvar depoimento</SubmitButton>
                    </div>
                  </form>

                  <form action={deleteTestimonialAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="danger-button">
                      Remover
                    </button>
                  </form>
                </article>
              ))}
            </div>

            <form action={createTestimonialAction} className="admin-form admin-form-divider">
              <h4>Novo depoimento</h4>
              <div className="form-grid">
                <label className="field">
                  <span>Autor</span>
                  <input name="author" required />
                </label>
                <label className="field">
                  <span>Cargo</span>
                  <input name="role" required />
                </label>
              </div>
              <label className="field">
                <span>Depoimento</span>
                <textarea name="quote" rows={4} required />
              </label>
              <div className="form-grid">
                <label className="field compact-field">
                  <span>Nota</span>
                  <input name="rating" type="number" min="1" max="5" defaultValue={5} />
                </label>
                <label className="field compact-field">
                  <span>Ordem</span>
                  <input name="sortOrder" type="number" defaultValue={testimonials.length + 1} />
                </label>
              </div>
              <SubmitButton>Criar depoimento</SubmitButton>
            </form>
          </section>

          <section className="admin-card">
            <div className="admin-card-head">
              <div>
                <span className="kicker">Leads</span>
                <h3>Fluxo comercial vindo do site</h3>
              </div>
            </div>

            <div className="lead-board">
              {leads.length === 0 ? (
                <p className="empty-state">Nenhum lead ainda. Os novos pedidos do site aparecem aqui.</p>
              ) : (
                leads.map((lead) => (
                  <article key={lead.id} className="lead-card">
                    <div className="lead-card-head">
                      <div>
                        <strong>{lead.name}</strong>
                        <span>{lead.phone}</span>
                      </div>
                      <time>{formatDate(lead.createdAt)}</time>
                    </div>

                    <p>{lead.message}</p>

                    <div className="lead-meta">
                      <span>Sabor: {lead.favoriteFlavor || "Nao informado"}</span>
                      <span>Tipo: {lead.eventType || "Loja ou delivery"}</span>
                    </div>

                    <form action={updateLeadStatusAction} className="lead-status-form">
                      <input type="hidden" name="id" value={lead.id} />
                      <label className="field compact-field">
                        <span>Status</span>
                        <select name="status" defaultValue={lead.status}>
                          {Object.values(LeadStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                      <SubmitButton>Atualizar status</SubmitButton>
                    </form>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
