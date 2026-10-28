document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    const REPOSITORIO = "WM-PERSONALIZE/CATALOGO-WM", BRANCH = "main", ARQUIVO = "data/configuracao-visual.json";
    const itens = [
        ["logo", "Logo da loja", "Cabeçalho e rodapés"], ["favicon", "Ícone do navegador", "Aba do navegador (favicon)"],
        ["fachada", "Fachada da loja", "Página Inicial e Sobre"], ["interiorLoja", "Interior da loja", "Página Sobre"],
        ["imagemLoja", "Imagem complementar", "Página Sobre"], ["heroGrafica", "Imagem principal da Gráfica", "Página Gráfica"], ["destaqueGraficaHome", "Destaque de serviços gráficos", "Página Inicial"],
        ["fundoCatalogo", "Fundo do catálogo", "Início, Catálogo e Contato"]
    ];
    const padrao = { logo: "img/logo/logo.png", favicon: "img/favicon/favicon.ico", corRodape: "#1f1f1f", fundoCatalogo: "img/home/fundo-catalogo.png", fachada: "img/loja/fachada.png", interiorLoja: "img/loja/interior-01.png", imagemLoja: "img/loja/image.png", heroGrafica: "img/grafica/impressora.png", destaqueGraficaHome: "img/grafica/impressao.png", banners: [], historico: [] };
    const token = document.getElementById("tokenVisualGithub"), lista = document.getElementById("listaImagensVisuais"), banners = document.getElementById("listaBannersVisuais"), cor = document.getElementById("corRodapeVisual"), textoCor = document.getElementById("textoCorRodape"), previewRodape = document.getElementById("previewRodape"), mensagem = document.getElementById("mensagemVisual"), salvar = document.getElementById("salvarVisual"), restaurar = document.getElementById("restaurarVisual"), aviso = document.getElementById("desfazerVisual");
    let config = Object.assign({}, padrao, window.configuracaoVisual || {}), originais, arquivos = {}, bannersNovos = {}, antesDaPublicacao = null, temporizador;
    config.banners = Array.isArray(config.banners) ? config.banners : [];
    originais = copiar(config);

    function b64(texto) { const bytes = new TextEncoder().encode(texto); let bin = ""; bytes.forEach(function (b) { bin += String.fromCharCode(b); }); return btoa(bin); }
    function texto(b64texto) { const bin = atob(b64texto.replace(/\n/g, "")); return new TextDecoder().decode(Uint8Array.from(bin, function (c) { return c.charCodeAt(0); })); }
    function copiar(valor) { return JSON.parse(JSON.stringify(valor)); }
    function versao(valor) { const copia = copiar(valor); delete copia.historico; return copia; }
    function msg(valor, sucesso) { mensagem.textContent = valor; mensagem.classList.toggle("sucesso", sucesso === true); }
    async function api(caminho, chave, opcoes) {
        const metodo = opcoes && opcoes.metodo || "GET", resposta = await fetch("https://api.github.com/repos/" + REPOSITORIO + "/contents/" + caminho + (metodo === "GET" ? "?ref=" + BRANCH + "&t=" + Date.now() : ""), { method: metodo, headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + chave, "X-GitHub-Api-Version": "2022-11-28" }, body: opcoes && opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined });
        if (!resposta.ok) { const erro = await resposta.json().catch(function () { return {}; }); throw new Error(erro.message || "O GitHub não aceitou a alteração."); } return resposta.json();
    }
    async function obterRemoto(chave) { const arquivo = await api(ARQUIVO, chave, { metodo: "GET" }); return { config: Object.assign({}, padrao, JSON.parse(texto(arquivo.content))), sha: arquivo.sha }; }
    async function enviarImagem(arquivo, chave) {
        const nome = arquivo.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "png", caminho = "img/personalizacao/visual-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7) + "." + nome;
        const conteudo = await new Promise(function (resolve, reject) { const leitor = new FileReader(); leitor.onload = function () { resolve(String(leitor.result).split(",")[1]); }; leitor.onerror = reject; leitor.readAsDataURL(arquivo); });
        await api(caminho, chave, { metodo: "PUT", corpo: { message: "Adicionar imagem de personalização", content: conteudo, branch: BRANCH } }); return caminho;
    }
    function imagemValida(arquivo) { return arquivo && (arquivo.type.match(/^image\//) || /\.ico$/i.test(arquivo.name)) && arquivo.size <= 3 * 1024 * 1024; }
    function receberArquivo(chave, arquivo, indice) {
        if (!imagemValida(arquivo)) { msg("Escolha uma imagem PNG, JPG, WEBP, SVG ou ICO de até 3 MB."); return; }
        const leitor = new FileReader(); leitor.onload = function () { if (indice === undefined) { arquivos[chave] = arquivo; config[chave] = String(leitor.result); } else { bannersNovos[indice] = arquivo; config.banners[indice] = String(leitor.result); } renderizar(); }; leitor.readAsDataURL(arquivo);
    }
    function areaUpload(chave, titulo, subtitulo, atual, previa, indice) {
        const card = document.createElement("article"); card.className = "admin-visual-item";
        card.innerHTML = '<div><h3>' + titulo + '</h3><p>' + subtitulo + '</p></div><div class="admin-visual-comparacao"><figure><figcaption>Atual</figcaption><img src="' + atual + '" alt="Imagem atual de ' + titulo + '"></figure><figure><figcaption>Prévia</figcaption><img src="' + previa + '" alt="Prévia de ' + titulo + '"></figure></div><button type="button" class="admin-upload admin-upload-visual"><span class="admin-upload-icone">↑</span><span><strong>Arraste a nova imagem aqui</strong><small>ou clique para escolher</small></span></button>';
        const input = document.createElement("input"); input.type = "file"; input.accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico"; input.hidden = true; card.appendChild(input);
        const area = card.querySelector("button"); area.addEventListener("click", function () { input.click(); }); input.addEventListener("change", function () { receberArquivo(chave, input.files[0], indice); }); ["dragenter", "dragover"].forEach(function (evento) { area.addEventListener(evento, function (e) { e.preventDefault(); area.classList.add("arrastando"); }); }); ["dragleave", "drop"].forEach(function (evento) { area.addEventListener(evento, function (e) { e.preventDefault(); area.classList.remove("arrastando"); }); }); area.addEventListener("drop", function (e) { receberArquivo(chave, e.dataTransfer.files[0], indice); }); return card;
    }
    function renderizar() {
        lista.innerHTML = ""; itens.forEach(function (item) { lista.appendChild(areaUpload(item[0], item[1], item[2], originais[item[0]] || config[item[0]], config[item[0]])); });
        banners.innerHTML = ""; config.banners.forEach(function (banner, indice) { const card = areaUpload("banners", "Banner " + (indice + 1), "Página inicial", originais.banners[indice] || banner, banner, indice); const excluir = document.createElement("button"); excluir.type = "button"; excluir.className = "admin-link admin-remover-banner"; excluir.textContent = "Excluir banner"; excluir.addEventListener("click", function () { config.banners.splice(indice, 1); delete bannersNovos[indice]; renderizar(); }); card.appendChild(excluir); banners.appendChild(card); });
        cor.value = config.corRodape || "#1f1f1f"; textoCor.textContent = cor.value.toUpperCase(); previewRodape.style.background = cor.value;
    }
    async function publicar(novo, mensagemCommit) {
        const chave = token.value.trim(); if (!chave) throw new Error("Informe o token do GitHub para publicar.");
        const remoto = await obterRemoto(chave), antes = copiar(remoto.config), final = Object.assign({}, remoto.config, novo);
        final.historico = Array.isArray(remoto.config.historico) ? remoto.config.historico : []; final.historico.push({ data: new Date().toISOString(), configuracao: versao(antes) }); final.historico = final.historico.slice(-10);
        for (const chaveImagem of Object.keys(arquivos)) final[chaveImagem] = await enviarImagem(arquivos[chaveImagem], chave);
        for (const indice of Object.keys(bannersNovos)) final.banners[indice] = await enviarImagem(bannersNovos[indice], chave);
        await api(ARQUIVO, chave, { metodo: "PUT", corpo: { message: mensagemCommit, content: b64(JSON.stringify(final, null, 2) + "\n"), sha: remoto.sha, branch: BRANCH } });
        return { final: final, antes: antes };
    }
    salvar.addEventListener("click", async function () { salvar.disabled = true; try { if (!config.banners.length || config.banners.some(function (banner) { return !banner; })) throw new Error("Adicione pelo menos um banner e envie uma imagem para cada novo banner."); msg("Publicando aparência..."); const resultado = await publicar(config, "Atualizar aparência do site"); antesDaPublicacao = resultado.antes; config = resultado.final; originais = copiar(config); arquivos = {}; bannersNovos = {}; token.value = ""; renderizar(); msg("Aparência publicada. O site será atualizado em alguns minutos.", true); aviso.hidden = false; clearTimeout(temporizador); temporizador = setTimeout(function () { aviso.hidden = true; }, 20000); } catch (erro) { msg("Não foi possível publicar: " + erro.message); } finally { salvar.disabled = false; } });
    document.getElementById("adicionarBanner").addEventListener("click", function () { config.banners.push(""); renderizar(); });
    cor.addEventListener("input", function () { config.corRodape = cor.value; textoCor.textContent = cor.value.toUpperCase(); previewRodape.style.background = cor.value; });
    document.getElementById("fecharDesfazerVisual").addEventListener("click", function () { aviso.hidden = true; clearTimeout(temporizador); });
    document.getElementById("botaoDesfazerVisual").addEventListener("click", async function () { if (!antesDaPublicacao) return; salvar.disabled = true; try { const resultado = await publicar(antesDaPublicacao, "Desfazer alteração visual"); config = resultado.final; originais = copiar(config); arquivos = {}; bannersNovos = {}; aviso.hidden = true; msg("Alteração desfeita e publicada.", true); renderizar(); } catch (erro) { msg("Não foi possível desfazer: " + erro.message); } finally { salvar.disabled = false; } });
    restaurar.addEventListener("click", async function () { const chave = token.value.trim(); if (!chave) { msg("Informe o token do GitHub para restaurar."); return; } restaurar.disabled = true; try { const remoto = await obterRemoto(chave), historico = remoto.config.historico || [], ultimo = historico[historico.length - 1]; if (!ultimo || !ultimo.configuracao) throw new Error("Ainda não há uma versão anterior para restaurar."); config = Object.assign({}, padrao, ultimo.configuracao); arquivos = {}; bannersNovos = {}; const resultado = await publicar(config, "Restaurar versão anterior da aparência"); config = resultado.final; originais = copiar(config); token.value = ""; renderizar(); msg("Versão anterior restaurada e publicada.", true); } catch (erro) { msg("Não foi possível restaurar: " + erro.message); } finally { restaurar.disabled = false; } });
    renderizar();
});
