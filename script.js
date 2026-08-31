/* =========================================================
   SUSSUMU ECOA — script.js
   -----------------------------------------------------------
   O QUE ESTE ARQUIVO FAZ:
   1) Busca a lista de livros numa planilha do Google (publicada
      como CSV) — assim qualquer professor pode adicionar um
      livro só editando a planilha, sem mexer em código.
   2) Monta os cartões da vitrine, os filtros por categoria e
      a ficha de cada livro (modal), tudo automaticamente.

   O QUE VOCÊ PRECISA CONFIGURAR (veja CONFIG abaixo):
   - SHEET_CSV_URL: o link da planilha publicada como CSV.
   - LINK_PLANILHA_EDICAO: o link para a planilha "de verdade",
     usado no botão "Adicionar um livro".

   Veja o arquivo CONFIGURACAO.md para o passo a passo completo.
   ========================================================= */

const CONFIG = {
  // Cole aqui o link da planilha publicada como CSV.
  // (Arquivo > Compartilhar > Publicar na web > formato CSV)
  SHEET_CSV_URL: "",

  // Link da planilha original, para professores editarem.
  LINK_PLANILHA_EDICAO: "",

  // Pastas do repositório onde ficam os arquivos.
  PASTA_CAPAS: "livros/capas/",
  PASTA_PDFS: "livros/pdfs/",

  // Se a planilha ainda não estiver configurada, usamos este
  // arquivo local como exemplo — ótimo para testar o site antes
  // de publicar a planilha de verdade.
  CSV_EXEMPLO_LOCAL: "livros-exemplo.csv",
};

// Uma cor de destaque por categoria — ajuste ou adicione livremente.
const CORES_CATEGORIA = {
  "Consciência Negra": "#F6511D",
  "Meio Ambiente": "#0B6E4F",
  "Poesia": "#7B4FE0",
  "Matemática": "#1B7FA6",
  "História": "#C98A00",
};
const COR_PADRAO = "#5B5450";

/* ---------------------------------------------------------- */

const grade = document.getElementById("grade-livros");
const filtrosEl = document.getElementById("filtros");
const estadoEl = document.getElementById("estado-carregamento");
const numerosEl = document.getElementById("numeros");
const linkPlanilhaBtn = document.getElementById("link-planilha");

let TODOS_LIVROS = [];
let categoriaAtiva = "Todos";

init();

async function init() {
  if (CONFIG.LINK_PLANILHA_EDICAO) {
    linkPlanilhaBtn.href = CONFIG.LINK_PLANILHA_EDICAO;
  } else {
    linkPlanilhaBtn.title = "Configure LINK_PLANILHA_EDICAO em script.js";
  }

  try {
    const linhas = await carregarLinhasCSV();
    TODOS_LIVROS = linhas.map(normalizarLivro).filter((l) => l.titulo);
    estadoEl.remove();
    montarFiltros();
    renderizarGrade();
    montarNumeros();
  } catch (erro) {
    console.error(erro);
    estadoEl.textContent =
      "Não foi possível carregar os livros agora. Confira a configuração da planilha em script.js (SHEET_CSV_URL).";
  }
}

async function carregarLinhasCSV() {
  const url = CONFIG.SHEET_CSV_URL || CONFIG.CSV_EXEMPLO_LOCAL;
  const resposta = await fetch(url, { cache: "no-store" });
  if (!resposta.ok) throw new Error("Falha ao buscar CSV: " + resposta.status);
  const texto = await resposta.text();
  const resultado = Papa.parse(texto, { header: true, skipEmptyLines: true });
  return resultado.data;
}

function normalizarLivro(linha) {
  const arquivoParaCaminho = (valor, pasta) => {
    if (!valor) return "";
    valor = valor.trim();
    if (/^https?:\/\//i.test(valor)) return valor;
    return pasta + valor;
  };

  return {
    titulo: (linha.titulo || "").trim(),
    autores: (linha.autores || "").trim(),
    turma: (linha.turma || "").trim(),
    categoria: (linha.categoria || "Sem categoria").trim(),
    sinopse: (linha.sinopse || "").trim(),
    capa: arquivoParaCaminho(linha.link_capa || linha.capa, CONFIG.PASTA_CAPAS),
    pdf: arquivoParaCaminho(linha.link_pdf || linha.pdf, CONFIG.PASTA_PDFS),
  };
}

function montarFiltros() {
  const categorias = ["Todos", ...new Set(TODOS_LIVROS.map((l) => l.categoria))];
  filtrosEl.innerHTML = "";
  categorias.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filtro-btn";
    btn.type = "button";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", cat === categoriaAtiva ? "true" : "false");
    btn.style.setProperty("--cor-cat", CORES_CATEGORIA[cat] || COR_PADRAO);
    btn.addEventListener("click", () => {
      categoriaAtiva = cat;
      [...filtrosEl.children].forEach((b) =>
        b.setAttribute("aria-pressed", b === btn ? "true" : "false")
      );
      renderizarGrade();
    });
    filtrosEl.appendChild(btn);
  });
}

function renderizarGrade() {
  const lista =
    categoriaAtiva === "Todos"
      ? TODOS_LIVROS
      : TODOS_LIVROS.filter((l) => l.categoria === categoriaAtiva);

  grade.innerHTML = "";

  if (lista.length === 0) {
    grade.innerHTML = `<p class="estado">Ainda não há livros nesta categoria.</p>`;
    return;
  }

  lista.forEach((livro) => grade.appendChild(criarCard(livro)));
}

function criarCard(livro) {
  const cor = CORES_CATEGORIA[livro.categoria] || COR_PADRAO;

  const card = document.createElement("button");
  card.className = "livro-card";
  card.type = "button";
  card.setAttribute("aria-label", `Ver detalhes de ${livro.titulo}`);

  const iniciais = livro.titulo
    .split(" ")
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  card.innerHTML = `
    <div class="livro-capa" style="--cor-cat:${cor}">
      <span class="livro-tarja">${escapeHTML(livro.categoria)}</span>
      ${
        livro.capa
          ? `<img src="${livro.capa}" alt="Capa de ${escapeHTML(livro.titulo)}" loading="lazy" onerror="this.parentElement.querySelector('.livro-capa-fallback').style.display='flex'; this.remove();">`
          : ""
      }
      <div class="livro-capa-fallback" style="${livro.capa ? "display:none;" : ""}">${escapeHTML(livro.titulo)}</div>
    </div>
    <div class="livro-info">
      <h3>${escapeHTML(livro.titulo)}</h3>
      <p class="livro-autores">${escapeHTML(livro.turma ? livro.turma : livro.autores)}</p>
      <p class="livro-sinopse-curta">${escapeHTML(livro.sinopse)}</p>
    </div>
  `;

  card.addEventListener("click", () => abrirModal(livro));
  return card;
}

/* ---------------------------------------------------------- */
/* MODAL                                                       */
/* ---------------------------------------------------------- */

const backdrop = document.getElementById("modal-backdrop");
const modalCorpo = document.getElementById("modal-corpo");
const modalFechar = document.getElementById("modal-fechar");

function abrirModal(livro) {
  const cor = CORES_CATEGORIA[livro.categoria] || COR_PADRAO;
  modalCorpo.innerHTML = `
    ${
      livro.capa
        ? `<img class="modal-capa" src="${livro.capa}" alt="Capa de ${escapeHTML(livro.titulo)}">`
        : ""
    }
    <p class="modal-meta" style="color:${cor}">${escapeHTML(livro.categoria)}</p>
    <h3>${escapeHTML(livro.titulo)}</h3>
    <p class="modal-meta">${escapeHTML(livro.turma ? livro.turma : "")} ${
    livro.autores ? "· " + escapeHTML(livro.autores) : ""
  }</p>
    <p>${escapeHTML(livro.sinopse) || "Sinopse em breve."}</p>
    <div class="modal-acoes">
      ${
        livro.pdf
          ? `<a class="btn btn-primary" href="${livro.pdf}" target="_blank" rel="noopener">Ler o livro</a>
             <a class="btn btn-ghost" href="${livro.pdf}" download>Baixar PDF</a>`
          : `<p class="modal-meta">PDF ainda não disponível.</p>`
      }
    </div>
  `;
  backdrop.hidden = false;
  modalFechar.focus();
}

function fecharModal() {
  backdrop.hidden = true;
}

modalFechar.addEventListener("click", fecharModal);
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) fecharModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !backdrop.hidden) fecharModal();
});

/* ---------------------------------------------------------- */
/* NÚMEROS (calculados a partir dos dados reais)                */
/* ---------------------------------------------------------- */

function montarNumeros() {
  const totalLivros = TODOS_LIVROS.length;
  const totalCategorias = new Set(TODOS_LIVROS.map((l) => l.categoria)).size;
  const totalTurmas = new Set(
    TODOS_LIVROS.map((l) => l.turma).filter(Boolean)
  ).size;

  const itens = [
    { valor: totalLivros, rotulo: totalLivros === 1 ? "livro publicado" : "livros publicados" },
    { valor: totalCategorias, rotulo: totalCategorias === 1 ? "estante" : "estantes" },
    { valor: totalTurmas, rotulo: totalTurmas === 1 ? "turma autora" : "turmas autoras" },
  ];

  numerosEl.innerHTML = itens
    .map(
      (i) => `<div class="numero"><span class="valor">${i.valor}</span><span class="rotulo">${i.rotulo}</span></div>`
    )
    .join("");
}

/* ---------------------------------------------------------- */

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
