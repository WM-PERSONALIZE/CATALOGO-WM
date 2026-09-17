/* =========================================================
   WM PERSONALIZE
   ÍCONES DE MARCA (fonte única)
   =========================================================

   COMO USAR (no HTML):

       <span class="icone-marca" data-icone="whatsapp"></span>
       <span class="icone-marca" data-icone="instagram"></span>
       <span class="icone-marca" data-icone="busca"></span>

   O script abaixo troca automaticamente essas tags pelo
   vetor oficial. Assim, se um dia o logo mudar, basta
   alterar AQUI e o site inteiro muda junto.

   Tamanho e cor são controlados pelo CSS (o SVG usa
   width/height = 1em e fill = currentColor).
========================================================= */

(function () {

    "use strict";

    var ICONES = {

        /* Logo oficial do WhatsApp */
        whatsapp:
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
            '<path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.89c0 2.09.55 4.13 1.6 5.93L.07 24l6.32-1.66a11.88 11.88 0 0 0 5.66 1.44h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.18-1.24-6.17-3.42-8.41ZM12.06 21.74h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.75.98 1-3.65-.23-.38a9.86 9.86 0 0 1-1.51-5.21c0-5.43 4.42-9.85 9.86-9.85a9.8 9.8 0 0 1 6.97 2.89 9.82 9.82 0 0 1 2.89 6.98c0 5.43-4.42 9.85-9.83 9.85Zm5.4-7.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z"/>' +
            '</svg>',

        /* Logo oficial do Instagram */
        instagram:
            '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
            '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13-.67-.66-1.34-1.08-2.13-1.38-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Z"/>' +
            '<path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/>' +
            '<circle cx="18.41" cy="5.59" r="1.44"/>' +
            '</svg>',

        /* Lupa (mesma da página inicial) */
        busca:
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
            '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '<path d="M20 20L16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
            '</svg>'

    };


    function aplicarIcones(raiz) {

        var alvo = raiz || document;

        var elementos = alvo.querySelectorAll("[data-icone]");

        Array.prototype.forEach.call(elementos, function (elemento) {

            var nome = elemento.getAttribute("data-icone");

            if (!ICONES[nome]) {
                return;
            }

            /* Evita redesenhar um ícone já aplicado. */
            if (elemento.querySelector("svg")) {
                return;
            }

            elemento.innerHTML = ICONES[nome];

        });

    }


    /* Disponível para conteúdo criado por JavaScript. */
    window.WMIcones = {
        svg: ICONES,
        aplicar: aplicarIcones
    };


    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", function () {
            aplicarIcones();
        });

    } else {

        aplicarIcones();

    }

})();
