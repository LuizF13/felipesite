# Plataforma imobiliária — Europa ↔ Brasil

Projeto completo em **Next.js 16 + React 19 + TypeScript + Supabase** para uma imobiliária que atende brasileiros que vivem na Europa e querem analisar oportunidades no litoral de Santa Catarina.

## O que já está implementado

### Site público
- Landing page premium.
- Vídeo hero em `/public/videos/hero.mp4`.
- Vídeo da região em `/public/videos/regiao.mp4`.
- Narrativa Europa ↔ Brasil.
- Dados públicos com fontes FipeZAP/IBGE.
- Imóveis em destaque na home.
- Catálogo em `/imoveis`.
- Busca e filtros por cidade, tipo e status.
- Página individual `/imoveis/[slug]`.
- Tratamento específico para imóveis vendidos.
- Formulário de lead.
- Página de confirmação com CTA para WhatsApp.
- Layout responsivo.

### Painel administrativo
- Login com Supabase Auth.
- Proteção de `/admin`.
- Regra adicional de perfil administrativo.
- Dashboard.
- Cadastro de imóveis.
- Edição.
- Exclusão.
- Status:
  - Disponível
  - Reservado
  - Vendido
  - Indisponível
  - Rascunho
- Publicar/ocultar separado do status.
- Marcar imóvel como destaque.
- Upload de várias fotos.
- Definir foto de capa.
- Excluir foto.
- Storage do Supabase.
- Lista e atualização de status dos leads.

## Stack

- Next.js 16.3.6
- React 19.3.0
- TypeScript 7
- @supabase/ssr
- @supabase/supabase-js
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra:

```
http://localhost:3000
```

Sem Supabase configurado, o site público usa imóveis demonstrativos para permitir validar o layout.

## Variáveis

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_WHATSAPP=5547999999999
NEXT_PUBLIC_COMPANY_NAME="Nome da Imobiliária"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use a **Publishable Key** do Supabase no frontend. Não coloque uma secret key ou `service_role` em variável `NEXT_PUBLIC_`.

## Banco Supabase

A migration completa está em:

```
supabase/migrations/202609280001_initial.sql
```

Ela cria:

- `profiles`
- `properties`
- `property_images`
- `leads`
- índices
- triggers
- RLS
- grants
- bucket `property-media`
- policies do Storage

### Criar o primeiro administrador

1. Crie o usuário em **Authentication > Users** no Supabase.
2. Localize o UUID dele.
3. Rode:

```sql
update public.profiles
set is_admin = true
where id = 'UUID_DO_USUARIO';
```

Depois acesse:

```
/login
```

## Vídeos

Coloque os arquivos convertidos para H.264/MP4 em:

```
public/videos/hero.mp4
public/videos/regiao.mp4
```

O site já aponta para esses caminhos.

Exemplo de conversão:

```bash
ffmpeg -i original.MOV -c:v libx264 -crf 22 -preset medium -c:a aac -b:a 128k -movflags +faststart hero.mp4
```

## Produção

Fluxo sugerido:

1. Criar um projeto dedicado no Supabase.
2. Rodar a migration.
3. Criar o administrador.
4. Configurar as variáveis na Vercel.
5. Adicionar os vídeos à pasta `public/videos`.
6. Fazer deploy.
7. Cadastrar os imóveis reais pelo painel.

## Segurança

- O navegador não recebe chave `service_role`.
- Tabelas expostas usam RLS.
- Visitantes só leem imóveis publicados nos status públicos.
- Visitantes só podem criar leads com status inicial `new`.
- Somente perfil com `is_admin = true` altera imóveis, fotos e leads.
- O Storage permite escrita/exclusão somente para administradores autenticados.
- Autenticação SSR usa cookies e `@supabase/ssr`.
- `proxy.ts` renova a sessão e protege as rotas administrativas.

## Dados públicos exibidos

A home usa, como contexto de mercado:

- FipeZAP residencial — Itapema, abril/2026.
- IBGE — estimativas populacionais de Itapema e Porto Belo para 2026.

Esses dados são apresentados com fonte e aviso de que desempenho histórico e contexto regional não garantem valorização ou retorno futuro.

## Observação sobre imagens de demonstração

Enquanto o banco não está conectado, os cards de demonstração usam imagens remotas do Unsplash. Assim que os imóveis reais forem cadastrados, as imagens passam a vir do Supabase Storage.
