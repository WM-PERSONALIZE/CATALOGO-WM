/* =========================================================
   WM PERSONALIZE
   BANCO DE PRODUTOS
========================================================= */


/*
    CATEGORIAS DISPONÍVEIS

    papelaria
    festa
    doces
    brinquedos
    utilidades

    Um produto pode possuir MAIS DE UMA categoria.
*/


const produtos = [

    /* =====================================================
       PRODUTO 001
    ====================================================== */

    {
        id: 1,

        nome: "Produto de Papelaria",

        imagem: "img/produtos/produto-001.png",

        categorias: [
            "papelaria"
        ],

        preco: null,

        descricao:
            "Produto de papelaria disponível na WM Personalize. Entre em contato para consultar detalhes, valor e disponibilidade.",

        destaque: true,

        popularidade: 90,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 002
    ====================================================== */

    {
        id: 2,

        nome: "Produto para Utilidades",

        imagem: "img/produtos/produto-002.png",

        categorias: [
            "utilidades"
        ],

        preco: null,

        descricao:
            "Produto útil para o dia a dia. Consulte nossa equipe para saber mais informações sobre o produto.",

        destaque: true,

        popularidade: 85,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 003
    ====================================================== */

    {
        id: 3,

        nome: "Produto Infantil",

        imagem: "img/produtos/produto-003.png",

        categorias: [
            "brinquedos"
        ],

        preco: null,

        descricao:
            "Produto infantil disponível na WM Personalize. Consulte nossa equipe para informações sobre valor e disponibilidade.",

        destaque: true,

        popularidade: 80,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 004
    ====================================================== */

    {
        id: 4,

        nome: "Artigo para Festa",

        imagem: "img/produtos/produto-004.png",

        categorias: [
            "festa"
        ],

        preco: null,

        descricao:
            "Artigo para festas e comemorações. Consulte nossa equipe para conhecer as opções disponíveis.",

        destaque: true,

        popularidade: 78,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 005
    ====================================================== */

    {
        id: 5,

        nome: "Produto Multiuso",

        imagem: "img/produtos/produto-005.png",

        categorias: [
            "utilidades",
            "papelaria"
        ],

        preco: null,

        descricao:
            "Produto versátil para diferentes necessidades do dia a dia.",

        destaque: false,

        popularidade: 75,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 006
    ====================================================== */

    {
        id: 6,

        nome: "Produto para Doces",

        imagem: "img/produtos/produto-006.png",

        categorias: [
            "doces",
            "festa"
        ],

        preco: null,

        descricao:
            "Produto disponível para quem procura opções de doces e itens para festas.",

        destaque: false,

        popularidade: 72,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 007
    ====================================================== */

    {
        id: 7,

        nome: "Material Escolar",

        imagem: "img/produtos/produto-007.png",

        categorias: [
            "papelaria"
        ],

        preco: null,

        descricao:
            "Material escolar disponível na WM Personalize.",

        destaque: false,

        popularidade: 70,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 008
    ====================================================== */

    {
        id: 8,

        nome: "Brinquedo Infantil",

        imagem: "img/produtos/produto-008.png",

        categorias: [
            "brinquedos"
        ],

        preco: null,

        descricao:
            "Brinquedo infantil disponível na loja. Consulte disponibilidade e valor.",

        destaque: false,

        popularidade: 68,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 009
    ====================================================== */

    {
        id: 9,

        nome: "Item para Organização",

        imagem: "img/produtos/produto-009.png",

        categorias: [
            "utilidades"
        ],

        preco: null,

        descricao:
            "Item para facilitar a organização e o dia a dia.",

        destaque: false,

        popularidade: 65,

        dataCadastro: "2026-09-01"
    },


    /* =====================================================
       PRODUTO 010
    ====================================================== */

    {
        id: 10,

        nome: "Item de Papelaria",

        imagem: "img/produtos/produto-010.png",

        categorias: [
            "papelaria",
            "utilidades"
        ],

        preco: null,

        descricao:
            "Item de papelaria que também pode ser utilizado no dia a dia.",

        destaque: false,

        popularidade: 62,

        dataCadastro: "2026-09-01"
    },


     /* =====================================================
       PRODUTO 011
    ====================================================== */

    {
        id: 10,

        nome: "Item de Papelaria",

        imagem: "img/produtos/produto-002.png",

        categorias: [
            "papelaria",
            "utilidades"
        ],

        preco: null,

        descricao:
            "Item de papelaria que também pode ser utilizado no dia a dia.",

        destaque: false,

        popularidade: 62,

        dataCadastro: "2026-09-01"
    }


    




    
];


/* =========================================================
   CONFIGURAÇÕES DO CATÁLOGO
========================================================= */


/*
    Nomes que serão exibidos no site.
*/

const nomesCategorias = {

    papelaria: "Papelaria",

    festa: "Artigos de festa",

    doces: "Doces",

    brinquedos: "Brinquedos",

    utilidades: "Utilidades"

};


/* =========================================================
   FORMATAÇÃO DE PREÇO
========================================================= */

function formatarPreco(preco) {

    if (
        preco === null ||
        preco === undefined ||
        preco === ""
    ) {

        return "Consulte o preço";

    }


    return preco.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================================
   BUSCAR PRODUTO PELO ID
========================================================= */

function buscarProdutoPorId(id) {

    return produtos.find(
        produto => produto.id === Number(id)
    );

}


/* =========================================================
   BUSCAR PRODUTOS POR CATEGORIA
========================================================= */

function buscarProdutosPorCategoria(categoria) {

    return produtos.filter(
        produto =>
            produto.categorias.includes(categoria)
    );

}


/* =========================================================
   BUSCAR PRODUTOS PELO NOME
========================================================= */

function buscarProdutosPorNome(termo) {

    const busca = termo
        .toLowerCase()
        .trim();


    if (!busca) {

        return produtos;

    }


    return produtos.filter(produto => {

        return produto.nome
            .toLowerCase()
            .includes(busca);

    });

}


/* =========================================================
   PRODUTOS EM DESTAQUE
========================================================= */

function buscarProdutosEmDestaque() {

    return produtos.filter(
        produto => produto.destaque === true
    );

}


/* =========================================================
   PRODUTOS MAIS PROCURADOS
========================================================= */

function buscarProdutosPopulares() {

    return [...produtos].sort(
        (a, b) =>
            b.popularidade - a.popularidade
    );

}


/* =========================================================
   ORDENAÇÃO POR PREÇO
========================================================= */

function ordenarPorMenorPreco(lista) {

    return [...lista].sort((a, b) => {

        if (a.preco === null) return 1;

        if (b.preco === null) return -1;

        return a.preco - b.preco;

    });

}


function ordenarPorMaiorPreco(lista) {

    return [...lista].sort((a, b) => {

        if (a.preco === null) return 1;

        if (b.preco === null) return -1;

        return b.preco - a.preco;

    });

}


/* =========================================================
   ORDENAÇÃO ALFABÉTICA
========================================================= */

function ordenarAZ(lista) {

    return [...lista].sort((a, b) =>
        a.nome.localeCompare(
            b.nome,
            "pt-BR"
        )
    );

}


function ordenarZA(lista) {

    return [...lista].sort((a, b) =>
        b.nome.localeCompare(
            a.nome,
            "pt-BR"
        )
    );

}


/* =========================================================
   ORDENAÇÃO POR DATA
========================================================= */

function ordenarMaisRecentes(lista) {

    return [...lista].sort(
        (a, b) =>
            new Date(b.dataCadastro) -
            new Date(a.dataCadastro)
    );

}


/* =========================================================
   WHATSAPP DO PRODUTO
========================================================= */

function gerarMensagemProduto(produto) {

    return (
        `Olá! Tenho interesse no produto "${produto.nome}" ` +
        `que vi no catálogo. Gostaria de saber mais informações ` +
        `sobre disponibilidade e valor.`
    );

}


/* =========================================================
   LINK DO WHATSAPP
========================================================= */

function gerarLinkWhatsAppProduto(produto) {

    const telefone =
        "556298812925";

    const mensagem =
        gerarMensagemProduto(produto);

    return (
        `https://wa.me/${telefone}?text=` +
        encodeURIComponent(mensagem)
    );

}
