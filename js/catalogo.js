// ============================================================
// WM PERSONALIZE - CATÁLOGO
// Controle de busca, filtros, ordenação, cards e modal
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // --------------------------------------------------------
    // ELEMENTOS DA PÁGINA
    // --------------------------------------------------------

    const campoBusca = document.getElementById("buscaCatalogo");
    const formBusca = document.getElementById("formBuscaCatalogo");

    const botoesCategorias = document.querySelectorAll(".categoria-filtro");

    const filtroPreco = document.getElementById("filtroPreco");
    const valorPreco = document.getElementById("valorPreco");

    const ordenacao = document.getElementById("ordenacaoProdutos");

    const containerProdutos = document.getElementById("produtosCatalogo");
    const quantidadeResultados = document.getElementById("quantidadeResultados");
    const mensagemSemResultados = document.getElementById("mensagemSemResultados");

    // Modal
    const modal = document.getElementById("modalProduto");
    const modalFechar = document.querySelector(".modal-fechar");

    const modalImagem = document.getElementById("modalProdutoImagem");
    const modalCategoria = document.getElementById("modalProdutoCategoria");
    const modalNome = document.getElementById("modalProdutoNome");
    const modalDescricao = document.getElementById("modalProdutoDescricao");
    const modalPreco = document.getElementById("modalProdutoPreco");
    const modalWhatsApp = document.getElementById("modalProdutoWhatsApp");


    // --------------------------------------------------------
    // ESTADO DO CATÁLOGO
    // --------------------------------------------------------

    let categoriaAtual = "todos";
    let termoBusca = "";
    let precoFiltroMaximo = null;
    let ordemAtual = "relevantes";


    // --------------------------------------------------------
    // FUNÇÕES AUXILIARES
    // --------------------------------------------------------

    function escaparHTML(texto) {

        if (texto === null || texto === undefined) {
            return "";
        }

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function obterNomeCategoria(categoria) {

        if (typeof nomesCategorias !== "undefined" &&
            nomesCategorias[categoria]) {

            return nomesCategorias[categoria];
        }

        return categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }


    function obterCategoriasProduto(produto) {

        if (!produto.categorias || produto.categorias.length === 0) {
            return "Sem categoria";
        }

        return produto.categorias
            .map(categoria => obterNomeCategoria(categoria))
            .join(" • ");
    }


    // --------------------------------------------------------
    // PREÇO MÁXIMO DISPONÍVEL
    // --------------------------------------------------------

    function descobrirPrecoMaximo() {

        const produtosComPreco = produtos.filter(function (produto) {
            return typeof produto.preco === "number" &&
                   !isNaN(produto.preco);
        });

        if (produtosComPreco.length === 0) {
            return 1000;
        }

        const maiorPreco = Math.max(
            ...produtosComPreco.map(produto => produto.preco)
        );

        // Arredonda para cima para facilitar o uso do slider
        return Math.ceil(maiorPreco / 10) * 10;
    }


    function configurarFiltroPreco() {

        if (!filtroPreco) {
            return;
        }

        const maiorPreco = descobrirPrecoMaximo();

        filtroPreco.min = 0;
        filtroPreco.max = maiorPreco;
        filtroPreco.value = maiorPreco;
        filtroPreco.step = 1;

        precoFiltroMaximo = maiorPreco;

        atualizarTextoPreco(maiorPreco);
    }


    function atualizarTextoPreco(valor) {

        if (!valorPreco) {
            return;
        }

        valorPreco.textContent = formatarPreco(valor);
    }


    // --------------------------------------------------------
    // LEITURA DOS PARÂMETROS DA URL
    // --------------------------------------------------------

    function lerParametrosURL() {

        const parametros = new URLSearchParams(window.location.search);

        const buscaURL = parametros.get("busca");
        const categoriaURL = parametros.get("categoria");
        const ordemURL = parametros.get("ordem");

        if (buscaURL) {
            termoBusca = buscaURL.trim().toLowerCase();

            if (campoBusca) {
                campoBusca.value = buscaURL;
            }
        }

        if (categoriaURL) {

            const categoriaExiste = Array.from(botoesCategorias)
                .some(botao => botao.dataset.categoria === categoriaURL);

            if (categoriaExiste) {
                categoriaAtual = categoriaURL;
            }
        }

        if (ordemURL) {

            if (ordenacao) {

                const opcaoExiste = Array.from(ordenacao.options)
                    .some(opcao => opcao.value === ordemURL);

                if (opcaoExiste) {
                    ordemAtual = ordemURL;
                    ordenacao.value = ordemURL;
                }
            }
        }

        atualizarCategoriaAtiva();
    }


    // --------------------------------------------------------
    // ATUALIZA BOTÃO DE CATEGORIA ATIVO
    // --------------------------------------------------------

    function atualizarCategoriaAtiva() {

        botoesCategorias.forEach(function (botao) {

            const categoria = botao.dataset.categoria;

            botao.classList.toggle(
                "ativo",
                categoria === categoriaAtual
            );
        });
    }


    // --------------------------------------------------------
    // FILTRAGEM DOS PRODUTOS
    // --------------------------------------------------------

    function filtrarProdutos() {

        let resultado = [...produtos];


        // --------------------------------------------
        // FILTRO POR CATEGORIA
        // --------------------------------------------

        if (categoriaAtual !== "todos") {

            resultado = resultado.filter(function (produto) {

                return Array.isArray(produto.categorias) &&
                       produto.categorias.includes(categoriaAtual);

            });
        }


        // --------------------------------------------
        // FILTRO POR NOME
        // --------------------------------------------

        if (termoBusca !== "") {

            resultado = resultado.filter(function (produto) {

                const nome = produto.nome
                    ? produto.nome.toLowerCase()
                    : "";

                const descricao = produto.descricao
                    ? produto.descricao.toLowerCase()
                    : "";

                return nome.includes(termoBusca) ||
                       descricao.includes(termoBusca);
            });
        }


        // --------------------------------------------
        // FILTRO POR PREÇO
        // --------------------------------------------

        if (precoFiltroMaximo !== null) {

            resultado = resultado.filter(function (produto) {

                // Produtos sem preço continuam aparecendo
                // porque possuem valor "Consulte o preço".
                if (produto.preco === null) {
                    return true;
                }

                return produto.preco <= precoFiltroMaximo;
            });
        }


        // --------------------------------------------
        // ORDENAÇÃO
        // --------------------------------------------

        resultado = ordenarProdutos(resultado);


        return resultado;
    }


    // --------------------------------------------------------
    // ORDENAÇÃO
    // --------------------------------------------------------

    function ordenarProdutos(lista) {

        const copia = [...lista];

        switch (ordemAtual) {

            case "procurados":

                return copia.sort(function (a, b) {
                    return (b.popularidade || 0) -
                           (a.popularidade || 0);
                });


            case "recentes":

                return ordenarMaisRecentes(copia);


            case "menor-preco":

                return ordenarMenorPrecoComNulos(copia);


            case "maior-preco":

                return ordenarMaiorPrecoComNulos(copia);


            case "az":

                return ordenarAZ(copia);


            case "za":

                return ordenarZA(copia);


            case "relevantes":
            default:

                return copia.sort(function (a, b) {

                    const destaqueA = a.destaque ? 1 : 0;
                    const destaqueB = b.destaque ? 1 : 0;

                    if (destaqueA !== destaqueB) {
                        return destaqueB - destaqueA;
                    }

                    return (b.popularidade || 0) -
                           (a.popularidade || 0);
                });
        }
    }


    function ordenarMenorPrecoComNulos(lista) {

        return lista.sort(function (a, b) {

            if (a.preco === null && b.preco === null) {
                return 0;
            }

            if (a.preco === null) {
                return 1;
            }

            if (b.preco === null) {
                return -1;
            }

            return a.preco - b.preco;
        });
    }


    function ordenarMaiorPrecoComNulos(lista) {

        return lista.sort(function (a, b) {

            if (a.preco === null && b.preco === null) {
                return 0;
            }

            if (a.preco === null) {
                return 1;
            }

            if (b.preco === null) {
                return -1;
            }

            return b.preco - a.preco;
        });
    }


    // --------------------------------------------------------
    // CRIAÇÃO DOS CARDS
    // --------------------------------------------------------

    function criarCardProduto(produto) {

        const artigo = document.createElement("article");

        artigo.className = "produto-card";

        artigo.dataset.produtoId = produto.id;


        // --------------------------------------------
        // BADGE
        // --------------------------------------------

        let badge = "";

        if (produto.destaque) {

            badge = `
                <span class="produto-badge">
                    Destaque
                </span>
            `;
        }


        // --------------------------------------------
        // CATEGORIAS
        // --------------------------------------------

        let categoriasHTML = "";

        if (Array.isArray(produto.categorias)) {

            categoriasHTML = produto.categorias
                .map(function (categoria) {

                    return `
                        <span class="produto-categoria">
                            ${escaparHTML(obterNomeCategoria(categoria))}
                        </span>
                    `;

                })
                .join("");
        }


        // --------------------------------------------
        // PREÇO
        // --------------------------------------------

        let precoHTML = "";

        if (produto.preco === null) {

            precoHTML = `
                <span class="produto-preco consultar">
                    Consulte o preço
                </span>
            `;

        } else {

            precoHTML = `
                <span class="produto-preco">
                    ${escaparHTML(formatarPreco(produto.preco))}
                </span>
            `;
        }


        // --------------------------------------------
        // CARD
        // --------------------------------------------

        artigo.innerHTML = `

            <div class="produto-imagem">

                ${badge}

                <img
                    src="${escaparHTML(produto.imagem)}"
                    alt="${escaparHTML(produto.nome)}"
                    loading="lazy"
                >

            </div>

            <div class="produto-info">

                <div class="produto-categorias">
                    ${categoriasHTML}
                </div>

                <h3 class="produto-nome">
                    ${escaparHTML(produto.nome)}
                </h3>

                <div class="produto-rodape">

                    ${precoHTML}

                    <button
                        type="button"
                        class="botao botao-produto"
                        data-produto-id="${produto.id}"
                    >
                        Ver produto
                    </button>

                </div>

            </div>
        `;


        // --------------------------------------------
        // ERRO NA IMAGEM
        // --------------------------------------------

        const imagem = artigo.querySelector("img");

        imagem.addEventListener("error", function () {

            this.style.display = "none";

            const container = this.closest(".produto-imagem");

            if (container &&
                !container.querySelector(".placeholder-imagem")) {

                const placeholder = document.createElement("div");

                placeholder.className = "placeholder-imagem";

                placeholder.innerHTML = `
                    <span>Imagem indisponível</span>
                `;

                container.appendChild(placeholder);
            }
        });


        // --------------------------------------------
        // ABRIR PRODUTO
        // --------------------------------------------

        artigo.addEventListener("click", function (evento) {

            if (evento.target.closest("button")) {
                return;
            }

            abrirModalProduto(produto.id);
        });


        const botao = artigo.querySelector(".botao-produto");

        if (botao) {

            botao.addEventListener("click", function () {

                abrirModalProduto(produto.id);

            });
        }


        return artigo;
    }


    // --------------------------------------------------------
    // RENDERIZAÇÃO DO CATÁLOGO
    // --------------------------------------------------------

    function renderizarCatalogo() {

        if (!containerProdutos) {
            return;
        }

        const resultado = filtrarProdutos();

        containerProdutos.innerHTML = "";


        // --------------------------------------------
        // QUANTIDADE DE RESULTADOS
        // --------------------------------------------

        if (quantidadeResultados) {

            quantidadeResultados.textContent =
                resultado.length +
                (resultado.length === 1
                    ? " produto encontrado"
                    : " produtos encontrados");
        }


        // --------------------------------------------
        // NENHUM RESULTADO
        // --------------------------------------------

        if (resultado.length === 0) {

            if (mensagemSemResultados) {
                mensagemSemResultados.classList.remove("oculto");
            }

            return;
        }


        if (mensagemSemResultados) {
            mensagemSemResultados.classList.add("oculto");
        }


        // --------------------------------------------
        // ADICIONA OS CARDS
        // --------------------------------------------

        resultado.forEach(function (produto) {

            const card = criarCardProduto(produto);

            containerProdutos.appendChild(card);

        });
    }


    // --------------------------------------------------------
    // MODAL DO PRODUTO
    // --------------------------------------------------------

    function abrirModalProduto(id) {

        const produto = buscarProdutoPorId(id);

        if (!produto || !modal) {
            return;
        }


        // --------------------------------------------
        // IMAGEM
        // --------------------------------------------

        if (modalImagem) {

            modalImagem.src = produto.imagem;
            modalImagem.alt = produto.nome;

            modalImagem.onerror = function () {

                this.style.display = "none";

            };
        }


        // --------------------------------------------
        // CATEGORIA
        // --------------------------------------------

        if (modalCategoria) {

            modalCategoria.textContent =
                obterCategoriasProduto(produto);
        }


        // --------------------------------------------
        // NOME
        // --------------------------------------------

        if (modalNome) {
            modalNome.textContent = produto.nome;
        }


        // --------------------------------------------
        // DESCRIÇÃO
        // --------------------------------------------

        if (modalDescricao) {

            modalDescricao.textContent =
                produto.descricao || "Sem descrição disponível.";
        }


        // --------------------------------------------
        // PREÇO
        // --------------------------------------------

        if (modalPreco) {

            modalPreco.textContent =
                formatarPreco(produto.preco);
        }


        // --------------------------------------------
        // WHATSAPP
        // --------------------------------------------

        if (modalWhatsApp) {

            modalWhatsApp.href =
                gerarLinkWhatsAppProduto(produto);

            modalWhatsApp.target = "_blank";
            modalWhatsApp.rel = "noopener noreferrer";
        }


        // --------------------------------------------
        // ABRE O MODAL
        // --------------------------------------------

        modal.classList.add("ativo");

        document.body.classList.add("modal-aberto");
    }


    function fecharModalProduto() {

        if (!modal) {
            return;
        }

        modal.classList.remove("ativo");

        document.body.classList.remove("modal-aberto");
    }


    // --------------------------------------------------------
    // EVENTOS DAS CATEGORIAS
    // --------------------------------------------------------

    botoesCategorias.forEach(function (botao) {

        botao.addEventListener("click", function () {

            categoriaAtual =
                this.dataset.categoria || "todos";

            atualizarCategoriaAtiva();

            atualizarURL();

            renderizarCatalogo();

        });

    });


    // --------------------------------------------------------
    // BUSCA
    // --------------------------------------------------------

    if (formBusca) {

        formBusca.addEventListener("submit", function (evento) {

            evento.preventDefault();

            if (!campoBusca) {
                return;
            }

            termoBusca =
                campoBusca.value.trim().toLowerCase();

            atualizarURL();

            renderizarCatalogo();

        });
    }


    if (campoBusca) {

        campoBusca.addEventListener("input", function () {

            termoBusca =
                this.value.trim().toLowerCase();

            renderizarCatalogo();

        });
    }


    // --------------------------------------------------------
    // FILTRO DE PREÇO
    // --------------------------------------------------------

    if (filtroPreco) {

        filtroPreco.addEventListener("input", function () {

            precoFiltroMaximo =
                Number(this.value);

            atualizarTextoPreco(precoFiltroMaximo);

            renderizarCatalogo();

        });
    }


    // --------------------------------------------------------
    // ORDENAÇÃO
    // --------------------------------------------------------

    if (ordenacao) {

        ordenacao.addEventListener("change", function () {

            ordemAtual = this.value;

            atualizarURL();

            renderizarCatalogo();

        });
    }


    // --------------------------------------------------------
    // FECHAR MODAL
    // --------------------------------------------------------

    if (modalFechar) {

        modalFechar.addEventListener("click", function () {

            fecharModalProduto();

        });
    }


    if (modal) {

        modal.addEventListener("click", function (evento) {

            if (evento.target === modal) {
                fecharModalProduto();
            }

        });
    }


    // --------------------------------------------------------
    // ESC PARA FECHAR
    // --------------------------------------------------------

    document.addEventListener("keydown", function (evento) {

        if (evento.key === "Escape") {
            fecharModalProduto();
        }

    });


    // --------------------------------------------------------
    // ATUALIZA URL SEM RECARREGAR
    // --------------------------------------------------------

    function atualizarURL() {

        const parametros =
            new URLSearchParams(window.location.search);


        // Busca

        if (termoBusca) {
            parametros.set("busca", termoBusca);
        } else {
            parametros.delete("busca");
        }


        // Categoria

        if (categoriaAtual !== "todos") {
            parametros.set("categoria", categoriaAtual);
        } else {
            parametros.delete("categoria");
        }


        // Ordenação

        if (ordemAtual !== "relevantes") {
            parametros.set("ordem", ordemAtual);
        } else {
            parametros.delete("ordem");
        }


        const novaURL =
            window.location.pathname +
            (parametros.toString()
                ? "?" + parametros.toString()
                : "");


        window.history.replaceState({}, "", novaURL);
    }


    // --------------------------------------------------------
    // INICIALIZAÇÃO
    // --------------------------------------------------------

    configurarFiltroPreco();

    lerParametrosURL();

    renderizarCatalogo();


    // --------------------------------------------------------
    // ABERTURA DIRETA DE UM PRODUTO (catalogo.html?produto=ID)
    // Usado pelos cards da pagina inicial.
    // --------------------------------------------------------

    (function abrirProdutoDaURL() {

        var parametros = new URLSearchParams(window.location.search);

        var produtoURL = parametros.get("produto");

        if (!produtoURL) {
            return;
        }

        var id = parseInt(produtoURL, 10);

        if (isNaN(id)) {
            return;
        }

        var existe = produtos.some(function (produto) {
            return produto.id === id;
        });

        if (existe) {
            abrirModalProduto(id);
        }

    })();

});
