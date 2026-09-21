document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const REPOSITORIO = "WM-PERSONALIZE/CATALOGO-WM";
    const BRANCH = "main";
    const ARQUIVO_DADOS = "data/produtos.json";
    const form = document.getElementById("formProduto");
    const tokenGithub = document.getElementById("tokenGithub");
    const campoId = document.getElementById("produtoId");
    const nome = document.getElementById("nomeProduto");
    const descricao = document.getElementById("descricaoProduto");
    const preco = document.getElementById("precoProduto");
    const popularidade = document.getElementById("popularidadeProduto");
    const destaque = document.getElementById("destaqueProduto");
    const imagem = document.getElementById("imagemProduto");
    const areaUpload = document.getElementById("areaUpload");
    const preview = document.getElementById("previewImagem");
    const textoUpload = document.getElementById("textoUpload");
    const iconeUpload = document.getElementById("iconeUpload");
    const lista = document.getElementById("listaProdutosAdmin");
    const quantidade = document.getElementById("quantidadeProdutos");
    const mensagem = document.getElementById("mensagemFormulario");
    const botaoSalvar = document.getElementById("salvarProduto");
    const titulo = document.getElementById("titulo-formulario");
    const cancelar = document.getElementById("cancelarEdicao");
    let imagemAtual = "";
    let imagemNova = null;

    function escapar(texto) {
        const div = document.createElement("div");
        div.textContent = texto == null ? "" : String(texto);
        return div.innerHTML;
    }

    function mostrarMensagem(texto, sucesso) {
        mensagem.textContent = texto;
        mensagem.classList.toggle("sucesso", sucesso === true);
    }

    function definirCarregando(ativo) {
        botaoSalvar.disabled = ativo;
        botaoSalvar.textContent = ativo ? "Publicando no GitHub..." : (campoId.value ? "Salvar alterações" : "Cadastrar produto");
    }

    function textoParaBase64(texto) {
        const bytes = new TextEncoder().encode(texto);
        let binario = "";
        bytes.forEach(function (byte) { binario += String.fromCharCode(byte); });
        return btoa(binario);
    }

    function base64ParaTexto(base64) {
        const binario = atob(base64.replace(/\n/g, ""));
        const bytes = Uint8Array.from(binario, function (caractere) { return caractere.charCodeAt(0); });
        return new TextDecoder().decode(bytes);
    }

    async function requisicaoGitHub(caminho, token, opcoes) {
        const consulta = opcoes && opcoes.metodo === "GET"
            ? "?ref=" + BRANCH + "&atualizado=" + Date.now()
            : "";
        const resposta = await fetch("https://api.github.com/repos/" + REPOSITORIO + "/contents/" + caminho + consulta, {
            method: opcoes && opcoes.metodo ? opcoes.metodo : "GET",
            cache: "no-store",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Bearer " + token,
                "X-GitHub-Api-Version": "2022-11-28"
            },
            body: opcoes && opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined
        });
        if (!resposta.ok) {
            const erro = await resposta.json().catch(function () { return {}; });
            throw new Error(erro.message || "O GitHub não aceitou a alteração.");
        }
        return resposta.json();
    }

    async function obterProdutosPublicados(token) {
        const arquivo = await requisicaoGitHub(ARQUIVO_DADOS, token, { metodo: "GET" });
        const dados = JSON.parse(base64ParaTexto(arquivo.content));
        if (!Array.isArray(dados)) throw new Error("O arquivo de produtos publicado está inválido.");
        return { produtos: garantirIdsUnicos(dados.map(normalizarProduto)), sha: arquivo.sha };
    }

    async function publicarProdutos(listaProdutos, sha, token, mensagemCommit) {
        await requisicaoGitHub(ARQUIVO_DADOS, token, {
            metodo: "PUT",
            corpo: {
                message: mensagemCommit,
                content: textoParaBase64(JSON.stringify(listaProdutos, null, 2) + "\n"),
                sha: sha,
                branch: BRANCH
            }
        });
    }

    async function enviarImagem(arquivo, token) {
        const extensao = arquivo.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
        const caminho = "img/produtos/produto-" + Date.now() + "." + extensao;
        const conteudo = await new Promise(function (resolve, reject) {
            const leitor = new FileReader();
            leitor.onload = function () { resolve(String(leitor.result).split(",")[1]); };
            leitor.onerror = reject;
            leitor.readAsDataURL(arquivo);
        });
        await requisicaoGitHub(caminho, token, {
            metodo: "PUT",
            corpo: { message: "Adicionar imagem de produto", content: conteudo, branch: BRANCH }
        });
        return caminho;
    }

    function categoriasMarcadas() {
        return Array.from(document.querySelectorAll("#categoriasProduto input:checked"))
            .map(function (campo) { return campo.value; });
    }

    function lerPreco(valor) {
        const limpo = valor.trim().replace("R$", "").replace(/\./g, "").replace(",", ".");
        if (!limpo) return null;
        const numero = Number(limpo);
        return Number.isFinite(numero) && numero >= 0 ? numero : undefined;
    }

    function mostrarImagem(url, novoArquivo) {
        imagemAtual = url || "";
        imagemNova = novoArquivo || null;
        preview.hidden = !imagemAtual;
        preview.src = imagemAtual;
        textoUpload.hidden = Boolean(imagemAtual);
        iconeUpload.hidden = Boolean(imagemAtual);
    }

    function carregarArquivo(arquivo) {
        if (!arquivo) return;
        if (!arquivo.type.match(/^image\/(png|jpeg|webp)$/)) { mostrarMensagem("Escolha uma imagem PNG, JPG ou WEBP."); return; }
        if (arquivo.size > 2 * 1024 * 1024) { mostrarMensagem("A imagem precisa ter no máximo 2 MB."); return; }
        const leitor = new FileReader();
        leitor.onload = function () { mostrarImagem(String(leitor.result), arquivo); mostrarMensagem(""); };
        leitor.readAsDataURL(arquivo);
    }

    function limparFormulario() {
        form.reset();
        campoId.value = "";
        popularidade.value = "0";
        mostrarImagem("");
        titulo.textContent = "Novo produto";
        botaoSalvar.textContent = "Cadastrar produto";
        cancelar.hidden = true;
        mostrarMensagem("");
    }

    function renderizarLista() {
        quantidade.textContent = produtos.length;
        lista.innerHTML = "";
        if (!produtos.length) { lista.innerHTML = '<p class="admin-vazio">Ainda não há produtos cadastrados.</p>'; return; }
        produtos.slice().sort(function (a, b) { return b.id - a.id; }).forEach(function (produto) {
            const item = document.createElement("article");
            item.className = "admin-item-produto";
            item.innerHTML = '<img class="admin-item-imagem" src="' + escapar(produto.imagem) + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
                '<div class="admin-item-info"><h3>' + escapar(produto.nome) + '</h3><p>' + escapar(formatarPreco(produto.preco)) + ' · ' + escapar((produto.categorias || []).map(function (c) { return nomesCategorias[c] || c; }).join(", ")) + '</p>' +
                (produto.destaque ? '<span class="admin-item-selo">Em destaque</span>' : '') + '</div>' +
                '<div class="admin-item-acoes"><button type="button" class="admin-editar" data-editar="' + produto.id + '">Editar</button><button type="button" class="admin-excluir" data-excluir="' + produto.id + '">Excluir</button></div>';
            lista.appendChild(item);
        });
    }

    function editarProduto(id) {
        const produto = produtos.find(function (item) { return item.id === Number(id); });
        if (!produto) return;
        campoId.value = produto.id; nome.value = produto.nome; descricao.value = produto.descricao;
        preco.value = produto.preco == null ? "" : String(produto.preco).replace(".", ",");
        popularidade.value = produto.popularidade || 0; destaque.checked = produto.destaque === true;
        document.querySelectorAll("#categoriasProduto input").forEach(function (campo) { campo.checked = produto.categorias.includes(campo.value); });
        mostrarImagem(produto.imagem); titulo.textContent = "Editar produto"; botaoSalvar.textContent = "Salvar alterações"; cancelar.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function proximoId(listaProdutos) { return listaProdutos.reduce(function (maior, produto) { return Math.max(maior, Number(produto.id) || 0); }, 0) + 1; }

    areaUpload.addEventListener("click", function () { imagem.click(); });
    imagem.addEventListener("change", function () { carregarArquivo(imagem.files[0]); });
    ["dragenter", "dragover"].forEach(function (evento) { areaUpload.addEventListener(evento, function (e) { e.preventDefault(); areaUpload.classList.add("arrastando"); }); });
    ["dragleave", "drop"].forEach(function (evento) { areaUpload.addEventListener(evento, function (e) { e.preventDefault(); areaUpload.classList.remove("arrastando"); }); });
    areaUpload.addEventListener("drop", function (e) { carregarArquivo(e.dataTransfer.files[0]); });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const token = tokenGithub.value.trim();
        const categorias = categoriasMarcadas();
        const valorPreco = lerPreco(preco.value);
        if (!token) { mostrarMensagem("Informe o token do GitHub para publicar."); return; }
        if (!nome.value.trim() || !descricao.value.trim() || !categorias.length || !imagemAtual) { mostrarMensagem("Preencha nome, descrição, categoria e imagem."); return; }
        if (valorPreco === undefined) { mostrarMensagem("Informe um preço válido, por exemplo 29,90."); return; }
        definirCarregando(true); mostrarMensagem("Enviando alteração ao GitHub...");
        try {
            const remoto = await obterProdutosPublicados(token);
            const id = campoId.value ? Number(campoId.value) : proximoId(remoto.produtos);
            const caminhoImagem = imagemNova ? await enviarImagem(imagemNova, token) : imagemAtual;
            const dados = { id: id, nome: nome.value.trim(), descricao: descricao.value.trim(), preco: valorPreco, categorias: categorias, destaque: destaque.checked, imagem: caminhoImagem, popularidade: Math.max(0, Number(popularidade.value) || 0), dataCadastro: new Date().toISOString().slice(0, 10) };
            const indice = remoto.produtos.findIndex(function (produto) { return produto.id === id; });
            if (indice >= 0) remoto.produtos[indice] = Object.assign({}, remoto.produtos[indice], dados);
            else remoto.produtos.push(dados);
            await publicarProdutos(remoto.produtos, remoto.sha, token, indice >= 0 ? "Atualizar produto: " + dados.nome : "Cadastrar produto: " + dados.nome);
            produtos.splice.apply(produtos, [0, produtos.length].concat(remoto.produtos));
            renderizarLista(); limparFormulario(); tokenGithub.value = "";
            mostrarMensagem("Produto publicado. O catálogo será atualizado pelo GitHub Pages em alguns minutos.", true);
        } catch (erro) { mostrarMensagem("Não foi possível publicar: " + erro.message); }
        finally { definirCarregando(false); }
    });

    lista.addEventListener("click", async function (e) {
        const editar = e.target.dataset.editar;
        const excluir = e.target.dataset.excluir;
        if (editar) editarProduto(editar);
        if (excluir) {
            const token = tokenGithub.value.trim();
            if (!token) { mostrarMensagem("Informe o token do GitHub antes de excluir."); return; }
            if (!confirm("Excluir este produto do catálogo publicado? A imagem antiga será mantida no repositório.")) return;
            definirCarregando(true); mostrarMensagem("Excluindo produto do GitHub...");
            try {
                const remoto = await obterProdutosPublicados(token);
                const novaLista = remoto.produtos.filter(function (produto) { return produto.id !== Number(excluir); });
                await publicarProdutos(novaLista, remoto.sha, token, "Excluir produto do catálogo");
                produtos.splice.apply(produtos, [0, produtos.length].concat(novaLista));
                renderizarLista(); if (campoId.value === excluir) limparFormulario(); tokenGithub.value = "";
                mostrarMensagem("Produto excluído. O catálogo será atualizado em alguns minutos.", true);
            } catch (erro) { mostrarMensagem("Não foi possível excluir: " + erro.message); }
            finally { definirCarregando(false); }
        }
    });
    cancelar.addEventListener("click", limparFormulario);
    renderizarLista();
});
