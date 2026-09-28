import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { PropertyCard } from "@/components/property-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedProperties } from "@/lib/properties";

export default async function HomePage() {
  const featured = await getFeaturedProperties();

  return (
    <>
      <SiteHeader />

      <main>
        <section className="hero">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />

          <div className="container hero-content">
            <p className="eyebrow">Brasil de perto · mesmo estando na Europa</p>
            <h1>Seu patrimônio pode atravessar o Atlântico.</h1>
            <p className="hero-copy">
              Informação local, oportunidades selecionadas e acompanhamento para
              brasileiros que vivem na Europa e estão considerando investir em
              imóveis no Brasil.
            </p>

            <div className="hero-actions">
              <Link href="/imoveis" className="button button-light">
                Conhecer oportunidades →
              </Link>
              <Link href="/#contato" className="button button-ghost">
                Falar com a equipe
              </Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split">
            <div>
              <p className="eyebrow dark">01 · Começa pelas perguntas certas</p>
              <h2 className="section-title">
                Investir à distância não precisa ser investir no escuro.
              </h2>
              <p className="lead">
                Antes de escolher um apartamento, é preciso entender região,
                objetivo, risco, empresa responsável e o momento daquele mercado.
              </p>
            </div>

            <div className="question-list">
              {[
                ["Onde investir?", "Entender quais regiões apresentam fundamentos compatíveis com o seu objetivo."],
                ["Que imóvel escolher?", "Patrimônio, renda, valorização e uso futuro pedem análises diferentes."],
                ["Em quem confiar?", "Incorporadora, documentação, histórico e produto também fazem parte da decisão."],
                ["Como acompanhar de longe?", "Uma equipe local pode visitar, comparar e acompanhar o mercado por você."],
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
              <p className="eyebrow">02 · Europa ↔ Brasil</p>
              <h2 className="section-title light">
                Você está na Europa.
                <br />
                Nós estamos aqui.
              </h2>
              <p className="lead light-muted">
                Nosso trabalho é transformar distância em informação: entender
                o seu perfil, acompanhar o mercado local e apresentar
                possibilidades que mereçam ser analisadas.
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

        <section className="section" id="regiao">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark">03 · A região</p>
                <h2 className="section-title">Itapema & Porto Belo.</h2>
              </div>
              <p className="lead">
                O objetivo não é vender apenas a paisagem. É mostrar os
                fundamentos por trás do desenvolvimento da região e deixar claro
                o que é dado, o que é contexto e o que ainda precisa ser analisado.
              </p>
            </div>

            <div className="region-video">
              <video controls playsInline poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85">
                <source src="/videos/regiao.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section className="section evidence">
          <div className="container">
            <p className="eyebrow dark">04 · Dados, não promessa</p>
            <h2 className="section-title">O mercado precisa ser lido com contexto.</h2>

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
                <p>Variação do índice de venda residencial de Itapema até abril de 2026.</p>
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
              Dados públicos ajudam a contextualizar o mercado, mas não garantem
              valorização ou retorno futuro. Cada imóvel precisa ser analisado
              individualmente.
            </p>
          </div>
        </section>

        <section className="section properties-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark">05 · Curadoria</p>
                <h2 className="section-title">Oportunidades selecionadas.</h2>
                <p className="lead">
                  O catálogo existe como uma área própria. A home mostra apenas
                  os imóveis que a equipe decide destacar.
                </p>
              </div>

              <Link href="/imoveis" className="button button-dark">
                Ver todos os imóveis →
              </Link>
            </div>

            <div className="property-grid">
              {featured.map((property) => (
                <PropertyCard property={property} key={property.id} />
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="como-funciona">
          <div className="container split process-grid">
            <div>
              <p className="eyebrow dark">06 · Como funciona</p>
              <h2 className="section-title">Não começamos pelo catálogo.</h2>
              <p className="lead">
                Começamos entendendo o seu objetivo e só depois cruzamos o seu
                perfil com as oportunidades do mercado.
              </p>
            </div>

            <div className="question-list">
              {[
                ["Conversamos com você", "Entendemos objetivo, momento e horizonte."],
                ["Analisamos oportunidades", "Comparamos regiões, projetos, incorporadoras e condições."],
                ["Mostramos cenários", "Organizamos as informações para facilitar a sua avaliação."],
                ["Acompanhamos o processo", "Existe uma equipe local durante as etapas da negociação."],
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
              <p className="eyebrow">07 · Próximo passo</p>
              <h2 className="section-title light">
                Se faz sentido para você, comece por uma conversa.
              </h2>
              <p className="lead light-muted">
                Conte o que procura. A equipe recebe o lead no painel e pode
                continuar o atendimento pelo canal definido pela imobiliária.
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
