document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const abas = document.querySelectorAll(".admin-aba");
    const paineis = document.querySelectorAll(".admin-aba-conteudo");

    abas.forEach(function (aba) {
        aba.addEventListener("click", function () {
            abas.forEach(function (item) {
                item.classList.toggle("ativa", item === aba);
            });

            paineis.forEach(function (painel) {
                painel.classList.toggle(
                    "ativa",
                    painel.dataset.painel === aba.dataset.aba
                );
            });
        });
    });
});
