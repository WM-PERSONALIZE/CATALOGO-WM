document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // WM PERSONALIZE - SERVIÇOS GRÁFICOS
    // ========================================================

    const numeroWhatsApp = "556298812925";

    const servicos = [
        {
            id: 1,
            nome: "Impressão",
            imagem: "img/grafica/impressora.png",
            descricao: "Impressões de documentos, trabalhos, atividades e outros materiais.",
            icone: "🖨️"
        },

        {
            id: 2,
            nome: "Xerox",
            imagem: "img/grafica/xerox.png",
            descricao: "Cópias de documentos e materiais em diferentes quantidades.",
            icone: "📄"
        },

        {
            id: 3,
            nome: "Encadernação",
            imagem: "img/grafica/encadernacao.png",
            descricao: "Encadernação de trabalhos, apostilas, documentos e outros materiais.",
            icone: "📚"
        },

        {
            id: 4,
            nome: "Plastificação",
            imagem: "img/grafica/plastificacao.png",
            descricao: "Proteção e acabamento para documentos, cartões, avisos e outros materiais.",
            icone: "🪪"
        },

        {
            id: 5,
            nome: "Cartão de visita",
            imagem: "img/grafica/cartao-visita.png",
            descricao: "Produção de cartões de visita personalizados para empresas e profissionais.",
            icone: "💼"
        },

        {
            id: 6,
            nome: "Panfleto",
            imagem: "img/grafica/panfleto.png",
            descricao: "Panfletos personalizados para divulgação de produtos, serviços e eventos.",
            icone: "📢"
        },

        {
            id: 7,
            nome: "Adesivo",
            imagem: "img/grafica/adesivo.png",
            descricao: "Adesivos personalizados para divulgação, identificação e decoração.",
            icone: "🏷️"
        },

        {
            id: 8,
            nome: "Arte digital",
            imagem: "img/grafica/arte-digital.png",
            descricao: "Criação de artes digitais personalizadas para diferentes finalidades.",
            icone: "🎨"
        }
    ];


    // ========================================================
    // ELEMENTO PRINCIPAL
    // ========================================================

    const container =
        document.getElementById("servicosGraficaLista");


    if (!container) {
        return;
    }


    // ========================================================
    // ESCAPAR HTML
    // Evita problemas caso algum nome ou descrição
    // contenha caracteres especiais.
    // ========================================================

    function escaparHTML(texto) {

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ========================================================
    // GERAR MENSAGEM DO WHATSAPP
    // ========================================================

    function gerarMensagemServico(servico) {

        return `Olá! Tenho interesse no serviço ${servico.nome}. Gostaria de saber mais informações sobre valores e prazo.`;
    }


    // ========================================================
    // GERAR LINK DO WHATSAPP
    // ========================================================

    function gerarLinkWhatsApp(servico) {

        const mensagem =
            encodeURIComponent(
                gerarMensagemServico(servico)
            );

        return `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    }


    // ========================================================
    // CRIAR CARD
    // ========================================================

    function criarCardServico(servico) {

        const artigo = document.createElement("article");

        artigo.className = "servico-card";


        artigo.innerHTML = `

            <div class="servico-imagem">

                <img
                    src="${escaparHTML(servico.imagem)}"
                    alt="${escaparHTML(servico.nome)}"
                    loading="lazy"
                >

                <span class="servico-icone">
                    ${servico.icone}
                </span>

            </div>


            <div class="servico-info">

                <h3>
                    ${escaparHTML(servico.nome)}
                </h3>

                <p>
                    ${escaparHTML(servico.descricao)}
                </p>

                <span class="servico-preco">
                    Consulte o preço
                </span>


                <a
                    href="${gerarLinkWhatsApp(servico)}"
                    class="botao botao-whatsapp servico-botao"
                    target="_blank"
                    rel="noopener noreferrer">

                    💬 Solicitar orçamento

                </a>

            </div>
        `;


        // ====================================================
        // FALLBACK PARA IMAGENS
        // ====================================================

        const imagem = artigo.querySelector("img");

        imagem.addEventListener("error", function () {

            this.style.display = "none";

            const containerImagem =
                this.closest(".servico-imagem");


            if (
                containerImagem &&
                !containerImagem.querySelector(".placeholder-imagem")
            ) {

                const placeholder =
                    document.createElement("div");

                placeholder.className =
                    "placeholder-imagem";

                placeholder.innerHTML = `
                    <span>
                        Imagem indisponível
                    </span>
                `;

                containerImagem.appendChild(
                    placeholder
                );
            }

        });


        return artigo;
    }


    // ========================================================
    // RENDERIZAR SERVIÇOS
    // ========================================================

    function renderizarServicos() {

        container.innerHTML = "";

        servicos.forEach(function (servico) {

            const card =
                criarCardServico(servico);

            container.appendChild(card);

        });
    }


    // ========================================================
    // INICIALIZAÇÃO
    // ========================================================

    renderizarServicos();

});
