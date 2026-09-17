/* =========================================================
   WM PERSONALIZE
   PRODUTOS EM DESTAQUE DA PÁGINA INICIAL
   =========================================================

   Os produtos vêm de js/produtos.js.

   Para um produto aparecer aqui, basta deixar
   "destaque: true" no cadastro dele. Nada mais precisa
   ser alterado nesta página.

   Ao clicar no card, o visitante vai para o catálogo já
   com o produto aberto (catalogo.html?produto=ID).
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    var container = document.getElementById("produtosDestaque");

    if (!container) {
        return;
    }

    if (typeof buscarProdutosEmDestaque !== "function") {
        return;
    }


    /* ---------------------------------------------------
       TEXTO SEGURO
    ---------------------------------------------------- */

    function escapar(texto) {

        var div = document.createElement("div");

        div.textContent = texto === undefined || texto === null
            ? ""
            : String(texto);

        return div.innerHTML;
    }


    /* ---------------------------------------------------
       NOME DA CATEGORIA
    ---------------------------------------------------- */

    var NOMES_CATEGORIAS = {
        papelaria: "Papelaria",
        festa: "Artigos de festa",
        doces: "Doces",
        brinquedos: "Brinquedos",
        utilidades: "Utilidades"
    };

    function nomeCategoria(produto) {

        if (!Array.isArray(produto.categorias) ||
            produto.categorias.length === 0) {

            return "Produto";
        }

        var chave = produto.categorias[0];

        return NOMES_CATEGORIAS[chave] || chave;
    }


    /* ---------------------------------------------------
       PREÇO
    ---------------------------------------------------- */

    function textoPreco(produto) {

        if (produto.preco === null || produto.preco === undefined) {
            return "Consulte o preço";
        }

        if (typeof formatarPreco === "function") {
            return formatarPreco(produto.preco);
        }

        return "R$ " + Number(produto.preco).toFixed(2).replace(".", ",");
    }


    /* ---------------------------------------------------
       CARD
    ---------------------------------------------------- */

    function criarCard(produto) {

        var card = document.createElement("a");

        card.className = "produto-card";
        card.href = "catalogo.html?produto=" + encodeURIComponent(produto.id);

        card.innerHTML =
            '<div class="produto-imagem">' +
                '<img src="' + escapar(produto.imagem) + '" ' +
                     'alt="' + escapar(produto.nome) + '" loading="lazy">' +
            '</div>' +
            '<div class="produto-info">' +
                '<span class="produto-categoria">' +
                    escapar(nomeCategoria(produto)) +
                '</span>' +
                '<h3>' + escapar(produto.nome) + '</h3>' +
                '<p class="produto-preco">' + escapar(textoPreco(produto)) + '</p>' +
            '</div>';


        /* Se a imagem não existir, mostra um espaço neutro. */

        var imagem = card.querySelector("img");

        imagem.addEventListener("error", function () {

            this.style.display = "none";

            var caixa = card.querySelector(".produto-imagem");

            if (caixa && !caixa.querySelector(".placeholder-imagem")) {

                var vazio = document.createElement("div");

                vazio.className = "placeholder-imagem";
                vazio.textContent = "Produto";

                caixa.appendChild(vazio);
            }
        });

        return card;
    }


    /* ---------------------------------------------------
       MONTAGEM
    ---------------------------------------------------- */

    var lista = buscarProdutosEmDestaque();

    container.innerHTML = "";

    if (!lista || lista.length === 0) {

        var aviso = document.createElement("p");

        aviso.className = "carrossel-vazio";
        aviso.textContent =
            "Em breve novos produtos em destaque.";

        container.appendChild(aviso);

        return;
    }

    lista.forEach(function (produto) {
        container.appendChild(criarCard(produto));
    });

});
