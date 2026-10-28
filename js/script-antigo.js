document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MENU MOBILE
    ====================================================== */

    const botaoMenuMobile = document.getElementById("botaoMenuMobile");
    const menuPrincipal = document.querySelector(".menu-principal");

    if (botaoMenuMobile && menuPrincipal) {

        botaoMenuMobile.addEventListener("click", () => {

            const menuAberto = menuPrincipal.classList.toggle("menu-aberto");

            document.body.classList.toggle("menu-aberto", menuAberto);

            botaoMenuMobile.classList.toggle("ativo", menuAberto);

            botaoMenuMobile.setAttribute(
                "aria-expanded",
                menuAberto ? "true" : "false"
            );

            botaoMenuMobile.setAttribute(
                "aria-label",
                menuAberto ? "Fechar menu" : "Abrir menu"
            );

        });


        /* Fecha o menu ao clicar em um link */

        const linksMenu = menuPrincipal.querySelectorAll("a");

        linksMenu.forEach((link) => {

            link.addEventListener("click", () => {

                menuPrincipal.classList.remove("menu-aberto");

                document.body.classList.remove("menu-aberto");

                botaoMenuMobile.classList.remove("ativo");

                botaoMenuMobile.setAttribute(
                    "aria-expanded",
                    "false"
                );

                botaoMenuMobile.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );

            });

        });


        /* Fecha o menu ao clicar fora dele */

        document.addEventListener("click", (event) => {

            const clicouNoMenu =
                menuPrincipal.contains(event.target);

            const clicouNoBotao =
                botaoMenuMobile.contains(event.target);

            if (
                !clicouNoMenu &&
                !clicouNoBotao &&
                menuPrincipal.classList.contains("menu-aberto")
            ) {

                menuPrincipal.classList.remove("menu-aberto");

                document.body.classList.remove("menu-aberto");

                botaoMenuMobile.classList.remove("ativo");

                botaoMenuMobile.setAttribute(
                    "aria-expanded",
                    "false"
                );

                botaoMenuMobile.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );

            }

        });

    }


    /* =====================================================
       BANNER PRINCIPAL
    ====================================================== */

    const bannerImagem = document.getElementById("bannerPrincipal");

    const botaoAnterior = document.getElementById("bannerAnterior");

    const botaoProximo = document.getElementById("bannerProximo");

    const containerIndicadores =
        document.getElementById("bannerIndicadores");

    let indicadores = [];


    /*
        Caminhos dos banners.

        Para adicionar um banner, salve a imagem em img/home/
        e inclua o caminho nesta lista. Arquivos que ainda não
        existem são ignorados, sem quebrar o carrossel.
    */

    const banners = [
        "img/home/banner-01.png",
        "img/home/banner-02.png",
        "img/home/banner-03.png",
        "img/home/banner-04.png"
    ];

    let bannersDisponiveis = [];


    let bannerAtual = 0;

    let intervaloBanner;


    /* =====================================================
       PREPARAR INDICADORES
    ====================================================== */

    function criarIndicadores() {

        if (!containerIndicadores) {
            return;
        }

        containerIndicadores.innerHTML = "";

        indicadores = bannersDisponiveis.map((_, index) => {

            const indicador = document.createElement("button");

            indicador.type = "button";
            indicador.className = "indicador";
            indicador.dataset.slide = index;
            indicador.setAttribute(
                "aria-label",
                `Ir para o banner ${index + 1}`
            );

            indicador.addEventListener("click", () => {
                mostrarBanner(index);
                reiniciarIntervaloBanner();
            });

            containerIndicadores.appendChild(indicador);

            return indicador;
        });
    }


    /* =====================================================
       ALTERAR BANNER
    ====================================================== */

    function mostrarBanner(indice) {

        if (!bannerImagem || bannersDisponiveis.length === 0) {
            return;
        }

        if (indice < 0) {
            indice = bannersDisponiveis.length - 1;
        }

        if (indice >= bannersDisponiveis.length) {
            indice = 0;
        }

        bannerAtual = indice;

        bannerImagem.style.opacity = "0";

        setTimeout(() => {

            bannerImagem.src = bannersDisponiveis[bannerAtual];
            bannerImagem.style.opacity = "1";

        }, 150);

        indicadores.forEach((indicador, index) => {

            indicador.classList.toggle(
                "ativo",
                index === bannerAtual
            );

        });

    }


    /* =====================================================
       BANNER ANTERIOR
    ====================================================== */

    if (botaoAnterior) {

        botaoAnterior.addEventListener("click", () => {

            mostrarBanner(bannerAtual - 1);

            reiniciarIntervaloBanner();

        });

    }


    /* =====================================================
       BANNER PRÓXIMO
    ====================================================== */

    if (botaoProximo) {

        botaoProximo.addEventListener("click", () => {

            mostrarBanner(bannerAtual + 1);

            reiniciarIntervaloBanner();

        });

    }


    /* =====================================================
       TROCA AUTOMÁTICA DO BANNER
    ====================================================== */

    function iniciarIntervaloBanner() {

        clearInterval(intervaloBanner);

        if (bannersDisponiveis.length < 2) {
            return;
        }

        intervaloBanner = setInterval(() => {

            mostrarBanner(bannerAtual + 1);

        }, 5000);

    }


    function reiniciarIntervaloBanner() {

        clearInterval(intervaloBanner);

        iniciarIntervaloBanner();

    }


    if (bannerImagem) {

        Promise.all(
            banners.map((caminho) => new Promise((resolver) => {

                const imagem = new Image();

                imagem.onload = () => resolver(caminho);
                imagem.onerror = () => resolver(null);
                imagem.src = caminho;

            }))
        ).then((resultados) => {

            bannersDisponiveis = resultados.filter(Boolean);
            criarIndicadores();
            mostrarBanner(0);
            iniciarIntervaloBanner();

        });

    }


    /* =====================================================
       PAUSAR BANNER AO PASSAR O MOUSE
    ====================================================== */

    const heroBanner = document.querySelector(".hero-banner");

    if (heroBanner) {

        heroBanner.addEventListener("mouseenter", () => {

            clearInterval(intervaloBanner);

        });


        heroBanner.addEventListener("mouseleave", () => {

            if (bannersDisponiveis.length > 1) {
                iniciarIntervaloBanner();
            }

        });

    }


    /* =====================================================
       BUSCA DA HOME
    ====================================================== */

    const formBuscaHome =
        document.getElementById("formBuscaHome");

    const buscaHome =
        document.getElementById("buscaHome");


    if (formBuscaHome && buscaHome) {

        formBuscaHome.addEventListener("submit", (event) => {

            event.preventDefault();

            const termo =
                buscaHome.value.trim();


            /*
                Se não digitou nada,
                simplesmente abre o catálogo.
            */

            if (!termo) {

                window.location.href = "catalogo.html";

                return;

            }


            /*
                Envia o termo para o catálogo.

                Exemplo:

                catalogo.html?busca=caderno
            */

            const buscaCodificada =
                encodeURIComponent(termo);

            window.location.href =
                `catalogo.html?busca=${buscaCodificada}`;

        });

    }


    /* =====================================================
       LINKS DE WHATSAPP
    ====================================================== */

    const linksWhatsApp =
        document.querySelectorAll(
            'a[href*="wa.me"]'
        );


    linksWhatsApp.forEach((link) => {

        link.addEventListener("click", () => {

            /*
                Mantemos o comportamento padrão do link.
                Este evento existe para permitir futuras
                funções de rastreamento ou estatísticas.
            */

        });

    });


    /* =====================================================
       IMAGENS COM ERRO
    ====================================================== */

    const imagens =
        document.querySelectorAll("img");


    imagens.forEach((imagem) => {

        imagem.addEventListener("error", () => {

            /*
                Não altera imagens que já possuem
                tratamento próprio de erro.

                Apenas evita que uma imagem quebrada
                fique aparecendo como ícone quebrado.
            */

            if (
                imagem.classList.contains(
                    "hero-banner-imagem"
                )
            ) {

                return;

            }

            imagem.style.opacity = "0.15";

        });

    });

});
