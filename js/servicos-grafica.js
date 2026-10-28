const servicosGraficaIniciais = [
    { id: 1, nome: "Impressão", imagem: "img/grafica/impressora.png", descricao: "Impressões de documentos, trabalhos, atividades e outros materiais.", icone: "🖨️" },
    { id: 2, nome: "Xerox", imagem: "img/grafica/xerox.png", descricao: "Cópias de documentos e materiais em diferentes quantidades.", icone: "📄" },
    { id: 3, nome: "Encadernação", imagem: "img/grafica/encadernacao.png", descricao: "Encadernação de trabalhos, apostilas, documentos e outros materiais.", icone: "📚" },
    { id: 4, nome: "Plastificação", imagem: "img/grafica/plastificacao.png", descricao: "Proteção e acabamento para documentos, cartões, avisos e outros materiais.", icone: "🪪" },
    { id: 5, nome: "Cartão de visita", imagem: "img/grafica/cartao-visita.png", descricao: "Produção de cartões de visita personalizados para empresas e profissionais.", icone: "💼" },
    { id: 6, nome: "Panfleto", imagem: "img/grafica/panfleto.png", descricao: "Panfletos personalizados para divulgação de produtos, serviços e eventos.", icone: "📢" },
    { id: 7, nome: "Adesivo", imagem: "img/grafica/adesivo.png", descricao: "Adesivos personalizados para divulgação, identificação e decoração.", icone: "🏷️" },
    { id: 8, nome: "Arte digital", imagem: "img/grafica/arte-digital.png", descricao: "Criação de artes digitais personalizadas para diferentes finalidades.", icone: "🎨" }
];

function normalizarServicoGrafica(servico, indice) {
    return {
        id: Number(servico.id) || Date.now() + indice,
        nome: String(servico.nome || "Serviço sem nome").trim(),
        imagem: String(servico.imagem || ""),
        descricao: String(servico.descricao || "").trim(),
        icone: String(servico.icone || "🖨️").trim()
    };
}

function carregarServicosGrafica() {
    try {
        const requisicao = new XMLHttpRequest();
        requisicao.open("GET", "data/servicos-grafica.json", false);
        requisicao.send(null);
        if (requisicao.status >= 200 && requisicao.status < 300) {
            const lista = JSON.parse(requisicao.responseText);
            if (Array.isArray(lista)) return lista.map(normalizarServicoGrafica);
        }
    } catch (erro) {
        console.warn("Não foi possível ler os serviços gráficos publicados.", erro);
    }
    return JSON.parse(JSON.stringify(servicosGraficaIniciais)).map(normalizarServicoGrafica);
}

const servicosGrafica = carregarServicosGrafica();
