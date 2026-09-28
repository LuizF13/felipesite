import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { PropertyCard } from "@/components/property-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrustVideo } from "@/components/trust-video";
import { getFeaturedProperties } from "@/lib/properties";

export default async function HomePage() {
  const featured = await getFeaturedProperties();

  return (
    <>
      <SiteHeader />

      <main>
        <section className="hero realty-hero">
          <div className="hero-overlay" />

          <div className="container hero-content">
            <div className="hero-kicker">
              <span>Itapema</span>
              <i />
              <span>Porto Belo</span>
              <i />
              <span>Santa Catarina</span>
            </div>

            <p className="eyebrow">Consultoria imobiliária · Brasil ↔ Europa</p>

            <h1>
              Seu próximo imóvel no Brasil,
              <em> visto de perto.</em>
            </h1>

            <p className="hero-copy">
              Curadoria de oportunidades, leitura de mercado e acompanhamento
              local para brasileiros que vivem na Europa e querem investir com
              mais informação no litoral catarinense.
            </p>

            <div className="hero-actions">
              <Link href="/imoveis" className="button button-light">
                Ver imóveis disponíveis →
              </Link>
              <Link href="/#video-apresentacao" className="button button-ghost">
                Conhecer nossa forma de trabalhar
              </Link>
            </div>

            <div className="hero-trust-strip">
              <div>
                <strong>Atendimento local</strong>
                <span>Equipe acompanhando a região no Brasil.</span>
              </div>
              <div>
                <strong>Curadoria</strong>
                <span>Imóveis selecionados por perfil e objetivo.</span>
              </div>
              <div>
                <strong>Brasil ↔ Europa</strong>
                <span>Processo pensado para quem está à distância.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section trust-section" id="video-apresentacao">
          <div className="container trust-layout">
            <div className="trust-copy">
              <p className="eyebrow dark">Uma conversa antes do imóvel</p>
              <h2 className="section-title">
                Conheça quem está do outro lado da sua decisão.
              </h2>
              <p className="lead">
                Investir à distância exige confiança. Por isso, antes de mostrar
                plantas e valores, queremos que você conheça a visão da equipe,
                entenda como analisamos as oportunidades e saiba quem estará aqui
                no Brasil acompanhando o processo com você.
              </p>

              <div className="trust-points">
                <div>
                  <strong>Presença local</strong>
                  <span>Conhecimento da região, obras e incorporadoras.</span>
                </div>
                <div>
                  <strong>Atendimento pessoal</strong>
                  <span>Contato direto com uma equipe real, sem catálogo automático.</span>
                </div>
                <div>
                  <strong>Decisão informada</strong>
                  <span>Dados, contexto e transparência antes da negociação.</span>
                </div>
              </div>
            </div>

            <TrustVideo />
          </div>
        </section>

        <section className="section properties-section home-properties">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark">Imóveis em destaque</p>
                <h2 className="section-title">Oportunidades selecionadas.</h2>
                <p className="lead">
                  Uma vitrine enxuta, com empreendimentos que a equipe escolheu
                  destacar. O catálogo completo fica em uma área própria.
                </p>
              </div>

              <Link href="/imoveis" className="button button-dark">
                Explorar todos os imóveis →
              </Link>
            </div>

            {featured.length ? (
              <div className="property-grid">
                {featured.map((property) => (
                  <PropertyCard property={property} key={property.id} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Os imóveis em destaque aparecerão aqui assim que forem publicados
                no painel administrativo.
              </div>
            )}
          </div>
        </section>

        <section className="section advisory-section">
          <div className="container split">
            <div>
              <p className="eyebrow dark">Antes da escolha</p>
              <h2 className="section-title">
                A compra começa pelas perguntas certas.
              </h2>
              <p className="lead">
                Um imóvel pode ser bonito e ainda assim não fazer sentido para o
                seu objetivo. A análise precisa considerar região, produto,
                incorporadora, condição e horizonte.
              </p>
            </div>

            <div className="question-list">
              {[
                [
                  "Onde investir?",
                  "Entender quais regiões apresentam fundamentos compatíveis com o seu objetivo.",
                ],
                [
                  "Que imóvel escolher?",
                  "Patrimônio, renda, valorização e uso futuro pedem análises diferentes.",
                ],
                [
                  "Em quem confiar?",
                  "Incorporadora, documentação, histórico e produto também fazem parte da decisão.",
                ],
                [
                  "Como acompanhar de longe?",
                  "Uma equipe local pode visitar, comparar e acompanhar o mercado por você.",
                ],
              ].map(([title, text], index) => (
                <article className="question-row" key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section bridge">
          <div className="container split">
            <div>
              <p className="eyebrow">Brasil ↔ Europa</p>
              <h2 className="section-title light">
                Você continua sua vida aí.
                <br />
                Nós acompanhamos daqui.
              </h2>
              <p className="lead light-muted">
                Nossa função é encurtar a distância: entender o seu perfil,
                acompanhar o mercado local e organizar as informações que você
                precisa para avaliar cada oportunidade.
              </p>
              <Link href="/#contato" className="button button-light">
                Conversar com a equipe →
              </Link>
            </div>

            <div className="route-card">
              <p className="eyebrow">A ponte</p>
              <div className="route-grid">
                <div>
                  <small>Você</small>
                  <strong>Europa</strong>
                  <span>objetivo · patrimônio · decisão</span>
                </div>
                <i />
                <div>
                  <small>Nossa equipe</small>
                  <strong>Brasil</strong>
                  <span>mercado · visitas · análise</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section region-section" id="regiao">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark">Onde estamos olhando</p>
                <h2 className="section-title">Itapema & Porto Belo.</h2>
              </div>
              <p className="lead">
                Localização continua sendo um dos principais fundamentos do
                mercado imobiliário. Aqui, a região é apresentada não só pela
                paisagem, mas por infraestrutura, desenvolvimento e dinâmica
                urbana.
              </p>
            </div>

            <div className="region-video">
              <video
                controls
                playsInline
                poster="/images/region-placeholder.svg"
              >
                <source src="/videos/regiao.mp4" type="video/mp4" />
              </video>
              <div className="region-video-label">
                <strong>Veja a região de perto</strong>
                <span>Imagens locais · litoral de Santa Catarina</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section evidence">
          <div className="container">
            <div className="section-heading evidence-heading">
              <div>
                <p className="eyebrow dark">Contexto de mercado</p>
                <h2 className="section-title">
                  Informação antes de qualquer promessa.
                </h2>
              </div>
              <p className="lead">
                Dados ajudam a entender o cenário. Eles não substituem a análise
                do imóvel e não representam garantia de retorno futuro.
              </p>
            </div>

            <div className="stats-grid">
              <article className="stat-card">
                <strong>R$ 15.179/m²</strong>
                <h3>Itapema</h3>
                <p>Preço médio de anúncios residenciais em abril de 2026.</p>
                <a
                  href="https://downloads.fipe.org.br/indices/fipezap/fipezap-202604-residencial-venda-publico.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Fonte: FipeZAP · abr/2026
                </a>
              </article>

              <article className="stat-card">
                <strong>+8,10%</strong>
                <h3>12 meses</h3>
                <p>
                  Variação do índice de venda residencial de Itapema até abril de
                  2026.
                </p>
                <a
                  href="https://downloads.fipe.org.br/indices/fipezap/fipezap-202604-residencial-venda-publico.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Fonte: FipeZAP · abr/2026
                </a>
              </article>

              <article className="stat-card">
                <strong>88.842</strong>
                <h3>Itapema</h3>
                <p>População estimada para 2026.</p>
                <a
                  href="https://www.ibge.gov.br/cidades-e-estados/sc/itapema.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Fonte: IBGE · 2026
                </a>
              </article>

              <article className="stat-card">
                <strong>32.615</strong>
                <h3>Porto Belo</h3>
                <p>População estimada para 2026.</p>
                <a
                  href="https://www.ibge.gov.br/cidades-e-estados/sc/porto-belo.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Fonte: IBGE · 2026
                </a>
              </article>
            </div>

            <p className="source-note">
              Cada investimento possui riscos próprios. Informações de mercado
              servem como contexto e não constituem garantia de valorização,
              rentabilidade ou retorno.
            </p>
          </div>
        </section>

        <section className="section" id="como-funciona">
          <div className="container split process-grid">
            <div>
              <p className="eyebrow dark">Como funciona</p>
              <h2 className="section-title">Um processo simples e acompanhado.</h2>
              <p className="lead">
                O catálogo é apenas uma parte. O atendimento começa entendendo
                você e termina com acompanhamento da negociação.
              </p>
            </div>

            <div className="question-list">
              {[
                ["Conversamos com você", "Entendemos objetivo, momento e horizonte."],
                [
                  "Analisamos oportunidades",
                  "Comparamos regiões, projetos, incorporadoras e condições.",
                ],
                [
                  "Mostramos cenários",
                  "Organizamos as informações para facilitar a sua avaliação.",
                ],
                [
                  "Acompanhamos o processo",
                  "Existe uma equipe local durante as etapas da negociação.",
                ],
              ].map(([title, text], index) => (
                <article className="question-row" key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contato">
          <div className="container contact-grid">
            <div>
              <p className="eyebrow">Próximo passo</p>
              <h2 className="section-title light">
                Conte o que você procura. Nós começamos pela conversa.
              </h2>
              <p className="lead light-muted">
                Sua solicitação chega ao painel da equipe para que o atendimento
                continue com contexto desde o primeiro contato.
              </p>
            </div>

            <LeadForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
