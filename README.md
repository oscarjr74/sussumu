# sussumu

Vou usar a diretriz de design do Claude para criar algo com identidade visual própria, e não um "template genérico". Deixa eu montar isso.

Criou 5 arquivos, executou 4 comandos, leu um arquivo · 2 notas

Pronto! Montei a primeira versão completa. Abre o preview pra ver funcionando — já vem com 5 livros de exemplo pra você navegar pela vitrine, testar o filtro por categoria e abrir a ficha de um livro.

O que foi construído:

Identidade visual própria: tipografia lúdica (Baloo 2 + Nunito Sans), estante ilustrada no topo, cada categoria com sua cor — nada de template genérico.
Vitrine data-driven: os cartões, filtros e a contagem de "livros publicados / estantes / turmas autoras" são gerados automaticamente a partir dos dados — nenhum livro precisa de HTML escrito à mão.
Ficha do livro (modal): capa, sinopse completa, autores/turma, botões "Ler" e "Baixar PDF".
Se faltar capa, o site mostra uma capa provisória colorida com o título — nada quebra visualmente enquanto vocês sobem os arquivos aos poucos.

Os arquivos para o GitHub:

index.html, style.css, script.js — substituem os atuais no repositório
data/livros-exemplo.csv — dados de exemplo (pode apagar depois)
CONFIGURACAO.md — passo a passo em português de como criar a planilha, publicar como CSV, colar o link em script.js, e onde colocar as capas/PDFs

O CONFIGURACAO.md é o mais importante agora — ele te leva pela mão desde criar a planilha até o site ir pro ar com GitHub Pages. Recomendo seguir ele com calma e me chamar se travar em algum passo, especialmente na parte de "publicar como CSV", que tem uma pegadinha de menu no Google Sheets
