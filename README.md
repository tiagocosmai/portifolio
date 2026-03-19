# Portifólio — site estático (React + Vite)

Site pessoal em **React 19**, **TypeScript**, **Vite 6** e **Tailwind CSS**, com conteúdo dirigido por **JSON** (três idiomas: PT / EN / ES). O build é estático e publicado na **raiz** de **[tiagocosmai.github.io](https://tiagocosmai.github.io)**.

[![Test](https://github.com/tiagocosmai/portifolio/actions/workflows/test.yml/badge.svg)](https://github.com/tiagocosmai/portifolio/actions/workflows/test.yml)
[![Deploy GitHub Pages](https://github.com/tiagocosmai/portifolio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/tiagocosmai/portifolio/actions/workflows/deploy-pages.yml)
[![codecov](https://codecov.io/gh/tiagocosmai/portifolio/graph/badge.svg)](https://codecov.io/gh/tiagocosmai/portifolio)

| | |
|---|---|
| **Repositório (código)** | [github.com/tiagocosmai/portifolio](https://github.com/tiagocosmai/portifolio) |
| **Site em produção** | [tiagocosmai.github.io](https://tiagocosmai.github.io) |
| **Repositório só do Pages** | [github.com/tiagocosmai/tiagocosmai.github.io](https://github.com/tiagocosmai/tiagocosmai.github.io) (branch `gh-pages`) |

---

## Visão geral

- **SPA** servida como ficheiros estáticos (`npm run build` → pasta `dist/`).
- **Internacionalização**: textos em `content.json` e `resources.json`; resolução em tempo de execução com `deepPick` conforme o idioma (`LocaleContext`).
- **Currículo / PDF**: geração a partir dos mesmos dados (`ResumeDownload`, `buildResumeHtml`, etc.).
- **Cursos**: fonte editável em `courses.txt` → `npm run sync:courses` gera `courses.json`; EN/ES via `courseI18n.ts`.

Documentação extra em `docs/`:

- [`docs/I18N.md`](docs/I18N.md) — idiomas e chaves de UI  
- [`docs/COURSES.md`](docs/COURSES.md) — formato de `courses.txt` e traduções  
- [`docs/CONTACT-RESEND.md`](docs/CONTACT-RESEND.md) — contacto (quando ativo)  
- [`DEPLOY.md`](DEPLOY.md) — segredos, PAT e GitHub Pages  

---

## Requisitos

- **Node.js** 22.x (alinhado com CI)  
- **npm** 10+

## Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | `tsc --noEmit` + build de produção em `dist/` |
| `npm run preview` | Pré-visualização local do `dist/` |
| `npm run test` | Testes (Vitest) |
| `npm run test:coverage` | Testes + relatório de cobertura |
| `npm run test:watch` | Vitest em modo watch |
| `npm run sync:courses` | Regenera `src/data/courses.json` a partir de `courses.txt` |
| `npm run deploy` | Build + publicação na branch `gh-pages` de `tiagocosmai.github.io` (local; ver `DEPLOY.md`) |

**Base URL:** `vite.config.ts` usa `base: "/"` para o site servido na raiz do domínio `*.github.io` do utilizador.

---

## Testes e cobertura

- **`npm run test`** — suíte mínima; podes expandir com mais ficheiros `*.test.tsx`.
- **`npm run test:coverage`** — gera:
  - relatório HTML: abre **`coverage/index.html`** no browser;
  - **`coverage/lcov.info`** — usado no CI para o [Codecov](https://codecov.io/gh/tiagocosmai/portifolio).

No GitHub Actions (workflow **Test**), a cobertura é enviada para o Codecov após cada push/PR nas branches `main` ou `master`. O badge no topo do README passa a refletir a percentagem quando o Codecov tiver recebido o primeiro relatório (repositório público; token opcional).

**Nota:** a cobertura atual é limitada (poucos testes); módulos como `Contact.tsx`, geração de PDF/HTML do CV e parte de `Navigation` aparecem com percentagens baixas até haver mais testes.

---

## Dados em `src/data/` — como dinamizar o site

### `content.json` — conteúdo principal por secção

Ficheiro grande com a estrutura do portfólio. A maior parte dos textos usa o padrão **triplo** para i18n:

```json
{ "pt": "…", "en": "…", "es": "…" }
```

O `LocaleProvider` importa o JSON e aplica **`deepPick(rawContent, locale)`**, produzindo o tipo **`PickedContent`** (`src/types/content.ts`): uma árvore já “achatada” para o idioma atual (só strings, arrays e objetos finais).

**Secções principais** (chaves de topo em `content.json`):

| Chave | Uso |
|-------|-----|
| `main` | Nome, cargo, avatar, redes (`social`), parágrafos introdutórios |
| `expertise` | Título + cartões (título, descrições, stack por idioma) |
| `certifications` | Selos Credly, imagens, links |
| `education` | Formação (datas, logos em `public/education-logos/` ou `logo_domain`) |
| `languages` | Idiomas e níveis CEFR |
| `history` | Experiência profissional (timeline) |
| `hobbies` | Ícones + rótulos |
| `projects` | Projetos profissionais / afiliação |
| `personal_projects` | Repositórios, `github_url`, `live_url` opcional |
| `contact` | Títulos da secção contacto |
| `footer` | Créditos e links do rodapé |

Campos que **não** são traduzidos (ex.: nome próprio, URLs, emails) permanecem como **string** simples.

Para alterar copy de secções: edita `content.json` mantendo a estrutura; se adicionares novos blocos com `{ pt, en, es }`, o TypeScript em `PickedContent` pode exigir atualizar `src/types/content.ts`.

### `resources.json` — UI e acessibilidade

Mapa **`chave → { pt, en, es }`** para tudo que não é “conteúdo editorial” longo:

- títulos da navegação, botões, temas, `aria-label`, mensagens de formulário, etc.

Novas chaves: inclui sempre **três** idiomas e usa `t("minha_chave")` via `useLocale()` nos componentes. Detalhes em [`docs/I18N.md`](docs/I18N.md).

### `config.json` — site e modos de CV

- **`site`**: `portfolioUrl`, limite de parágrafos no hero (`mainIntroParagraphsMax`).
- **`resume.modes`**: modos do currículo (`ultra_compact`, `compact`, `complete`, …) com listas de secções e flags de detalhe (histórico, skills, certificações, etc.) usados na geração do PDF/HTML.

### Cursos: `courses.txt` → `courses.json`

- Edita **`src/data/courses.txt`** (blocos `===Provedor===` ou `===Provedor|url===`, separadores `===PRESENCIAL===` e `===EVENTOS===`).
- Corre **`npm run sync:courses`** para atualizar **`courses.json`** (itens com campo `pt`).
- Traduções EN/ES: regras em **`src/lib/courseI18n.ts`** (ver [`docs/COURSES.md`](docs/COURSES.md)).

### Imagens e ficheiros estáticos

- **`public/`** — favicons, manifest, logos referenciados no JSON (`/education-logos/...`, etc.), `robots.txt`, `_redirects` (ex.: Netlify).

### Funcionalidades (flags)

- **`src/config/features.ts`** — por exemplo `SHOW_CONTACT` liga ou desliga a secção Contact e o respetivo item na navegação.

---

## Pipeline: deploy na URL raiz (`https://tiagocosmai.github.io/`)

O repositório **`portifolio`** contém **apenas o código-fonte**. O GitHub Pages do **utilizador** exige o repositório nomeado **`username.github.io`**; por isso o deploy **não** usa a pasta `docs/` nem a branch `gh-pages` deste repo para o site principal.

### Fluxo resumido

1. **Push** em `main` ou `master` em **`tiagocosmai/portifolio`** dispara [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).
2. **CI** instala dependências (`npm ci`), corre **`npm run build`** (Vite com `base: "/"`).
3. **Validação** do `dist/index.html`: existe, referencia `assets/`, **não** referencia `main.tsx`, **não** usa path `/tiagocosmai/` (garante site na raiz do domínio).
4. **Publicação** com `peaceiris/actions-gh-pages@v4`:
   - **`external_repository`:** `tiagocosmai/tiagocosmai.github.io`
   - **`publish_branch`:** `gh-pages`
   - **`publish_dir`:** `./dist`
   - **`personal_token`:** secret **`GH_PAGES_TOKEN`** (PAT classic com scope `repo`), porque o `GITHUB_TOKEN` do workflow não faz push noutro repositório por defeito.

### No repositório `tiagocosmai.github.io`

- **Settings → Pages:** origem **Deploy from a branch**, branch **`gh-pages`**, pasta **`/` (root)**.

### Localmente

- **`npm run deploy`** — mesmo destino (`gh-pages` de `tiagocosmai.github.io`), com validação do `dist/`. Requer permissão de push nesse repositório.

Instruções completas (criação do PAT, primeiro deploy): **[`DEPLOY.md`](DEPLOY.md)**.

---

## Licença

Ver ficheiro [`LICENSE`](LICENSE).
