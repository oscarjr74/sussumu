# Como configurar a livraria Sussumu Ecoa

Este site já funciona "pronto" com 5 livros de exemplo (arquivo
`data/livros-exemplo.csv`), só para você ver a vitrine funcionando.
Siga os passos abaixo para colocar os livros de verdade.

## Passo 1 — Criar a planilha de livros

1. Crie uma Google Planilha nova.
2. Na primeira linha, coloque exatamente estas colunas (nesta ordem):

   ```
   titulo | autores | turma | categoria | sinopse | link_capa | link_pdf
   ```

3. Cada linha seguinte é um livro. Em `link_capa` e `link_pdf`, escreva
   **apenas o nome do arquivo** (ex: `palavras-que-transformam.pdf`) —
   não o link inteiro. O site já sabe procurar dentro das pastas
   `livros/capas/` e `livros/pdfs/` do repositório.
4. Em `categoria`, use um destes nomes (ou adicione um novo — veja o
   Passo 4): `Consciência Negra`, `Meio Ambiente`, `Poesia`,
   `Matemática`, `História`.

## Passo 2 — Publicar a planilha como CSV

1. Na planilha: **Arquivo → Compartilhar → Publicar na web**.
2. Em "Link", escolha a aba com os livros e o formato **Valores
   separados por vírgula (.csv)**.
3. Clique em **Publicar** e copie o link gerado.

## Passo 3 — Colar o link no site

1. Abra o arquivo `script.js`.
2. No topo, encontre:
   ```js
   SHEET_CSV_URL: "",
   ```
3. Cole o link entre as aspas. Também preencha `LINK_PLANILHA_EDICAO`
   com o link normal da planilha (para o botão "Adicionar um livro"
   levar os professores até ela).

## Passo 4 — Subir as capas e os PDFs

1. Coloque os arquivos de capa (JPG ou PNG) dentro de `livros/capas/`.
2. Coloque os PDFs dentro de `livros/pdfs/`.
3. O nome do arquivo precisa ser **idêntico** ao que está escrito na
   planilha (maiúsculas/minúsculas e acentos incluídos — por isso é
   mais seguro nomear os arquivos sem acento e sem espaço, ex:
   `raizes-da-nossa-terra.pdf`).

Se um livro ainda não tiver capa, o site mostra automaticamente uma
capa provisória colorida com o título — nada quebra.

## Adicionar uma nova categoria

Para adicionar uma categoria além das 5 iniciais (ex: "Ciências"),
abra `script.js` e adicione uma linha em `CORES_CATEGORIA`:

```js
const CORES_CATEGORIA = {
  "Consciência Negra": "#F6511D",
  "Meio Ambiente": "#0B6E4F",
  "Poesia": "#7B4FE0",
  "Matemática": "#1B7FA6",
  "História": "#C98A00",
  "Ciências": "#2AA39F",   // <- nova categoria
};
```

Depois é só usar esse mesmo nome na coluna `categoria` da planilha.

## Publicando o site (GitHub Pages)

Se o repositório ainda não estiver publicado:

1. No GitHub, vá em **Settings → Pages**.
2. Em "Source", escolha a branch `main` e a pasta `/ (root)`.
3. Salve. Em alguns minutos o site estará no ar em
   `https://oscarjr74.github.io/ecoa/`.

## Testando localmente antes de publicar

Como o navegador bloqueia `fetch` de arquivos locais por segurança,
para testar no seu computador abra uma linha de comando na pasta do
projeto e rode:

```
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.
