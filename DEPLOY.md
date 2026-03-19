# Deploy no GitHub Pages — **https://tiagocosmai.github.io** (raiz)

O site público fica na **raiz** do domínio: `https://tiagocosmai.github.io`.  
Para isso o GitHub exige um repositório com o nome exato **`tiagocosmai.github.io`**.

O **código-fonte** fica no repositório **[tiagocosmai/portifolio](https://github.com/tiagocosmai/portifolio)**; o build (`dist/`) é publicado no **`tiagocosmai.github.io`** (branch `gh-pages`).

---

## 1. Criar o repositório do site

No GitHub, cria (ou mantém) um repositório com o nome **exato**:

`tiagocosmai.github.io`

(pode estar vazio; o deploy vai preencher a branch `gh-pages`.)

---

## 2. Configurar GitHub Pages nesse repositório

No repositório **tiagocosmai.github.io** (não no `portifolio`):

1. **Settings** → **Pages**
2. **Source**: *Deploy from a branch*
3. **Branch**: **gh-pages** → pasta **/ (root)**
4. Guardar

---

## 3. Deploy a partir do teu PC

Na pasta do projeto (`portifolio`):

```bash
npm run deploy
```

Isto corre `npm run build` (Vite com `base: "/"`), valida `dist/` e publica na branch **gh-pages** de **tiagocosmai.github.io**.

Na primeira vez, o GitHub pode pedir autenticação para o `gh-pages` fazer push nesse repo.

---

## 4. Deploy automático (GitHub Actions) a partir do repo **portifolio**

O workflow faz push do `dist/` para **outro** repositório (`tiagocosmai.github.io`). O `GITHUB_TOKEN` do workflow **não** tem permissão para isso por defeito.

1. Cria um **Personal Access Token (classic)** em GitHub → Settings → Developer settings → Personal access tokens, com scope **`repo`** (acesso ao `tiagocosmai.github.io`).
2. No repositório **`portifolio`** (onde está o código): **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Nome: **`GH_PAGES_TOKEN`**
   - Valor: o token gerado

Depois, cada **push** para `main` ou `master` no **portifolio** corre o workflow e atualiza o site em **https://tiagocosmai.github.io**.

---

## Por que dá 404 em `main.tsx`?

Isso acontece quando o Pages está a servir o **código-fonte** (ex.: branch `main` com o `index.html` de desenvolvimento) em vez do **build** em **gh-pages**. O `index.html` de dev aponta para `/src/main.tsx`; o build aponta para `/assets/...`.

---

## `npm ci` com E401 no CI

O **`package-lock.json`** deve usar URLs `https://registry.npmjs.org/...` (registry público). Lockfiles gerados atrás de um registry privado (ex.: JFrog) falham no GitHub sem credenciais. O `.npmrc` do projeto fixa o registry público.

---

## Testar o build em local

```bash
npm ci
npm run build
npm run preview
```

Abre `http://localhost:4173` — deve coincidir com o que vai para produção.

Não abras o `index.html` do projeto diretamente no browser sem o Vite; isso usa o HTML de desenvolvimento.

---
