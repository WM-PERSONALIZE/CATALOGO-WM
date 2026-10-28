/* Configuração visual publicada pelo painel administrativo. */
(function () {
    "use strict";
    const padrao = {
        logo: "img/logo/logo.png", favicon: "img/favicon/favicon.ico", corRodape: "#1f1f1f",
        fundoCatalogo: "img/home/fundo-catalogo.png", fachada: "img/loja/fachada.png",
        interiorLoja: "img/loja/interior-01.png", imagemLoja: "img/loja/image.png",
        heroGrafica: "img/grafica/impressora.png", destaqueGraficaHome: "img/grafica/impressao.png", banners: []
    };
    function carregar() {
        try {
            const pedido = new XMLHttpRequest();
            pedido.open("GET", "data/configuracao-visual.json?atualizado=" + Date.now(), false);
            pedido.send(null);
            if (pedido.status >= 200 && pedido.status < 300) return Object.assign({}, padrao, JSON.parse(pedido.responseText));
        } catch (erro) { console.warn("Não foi possível carregar a configuração visual.", erro); }
        return padrao;
    }
    const config = carregar();
    window.configuracaoVisual = config;
    document.documentElement.style.setProperty("--cor-rodape", config.corRodape);
    document.documentElement.style.setProperty("--imagem-fundo-catalogo", 'url("' + config.fundoCatalogo + '")');
    document.querySelectorAll("[data-imagem-visual]").forEach(function (imagem) {
        const chave = imagem.dataset.imagemVisual;
        if (config[chave]) imagem.src = config[chave];
    });
    document.querySelectorAll("img[data-logo-visual]").forEach(function (imagem) { imagem.src = config.logo; });
    document.querySelectorAll("link[rel~='icon']").forEach(function (icone) {
        icone.href = config.favicon + "?v=" + encodeURIComponent(config.favicon);
        icone.type = config.favicon.toLowerCase().endsWith(".png") ? "image/png" : "image/x-icon";
    });
}());
