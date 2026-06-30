document.addEventListener("DOMContentLoaded", () => {
    const sizeButtons = document.querySelectorAll(".size-btn");
    const priceCheckboxes = document.querySelectorAll(".checkbox-options input");
    const sortSelect = document.querySelector(".sort-select");
    const productsGrid = document.querySelector(".catalog-products-grid");
    const resultsCountText = document.querySelector(".results-count");

    let activeSize = null; 
    // Guarda a ordem original dos elementos para quando "Mais Relevantes" for selecionado
    const originalProductsArray = Array.from(document.querySelectorAll(".product-card"));

    // Evento de clique nos botões de tamanho
    sizeButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("selected")) {
                button.classList.remove("selected");
                activeSize = null;
            } else {
                sizeButtons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
                activeSize = button.textContent.trim();
            }
            executarFiltragemEOrdenacao();
        });
    });

    // Evento de mudança nos checkboxes de preço
    priceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            executarFiltragemEOrdenacao();
        });
    });

    // Evento de mudança no select de ordenação
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            executarFiltragemEOrdenacao();
        });
    }

    // Função central que gerencia filtros e ordenação ao mesmo tempo
    function executarFiltragemEOrdenacao() {
        let produtosVisiveis = 0;

        // 1. CAPTURAR FILTROS DE PREÇO
        const faixasPrecoSelecionadas = [];
        priceCheckboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                faixasPrecoSelecionadas.push(index);
            }
        });

        // 2. FILTRAGEM (Ocultar ou exibir cards baseado em critérios)
        originalProductsArray.forEach(card => {
            const tamanhosProduto = card.getAttribute("data-size").split(",");
            const precoProduto = parseFloat(card.getAttribute("data-price"));

            let atendeTamanho = true;
            if (activeSize && !tamanhosProduto.includes(activeSize)) {
                atendeTamanho = false;
            }

            let atendePreco = true;
            if (faixasPrecoSelecionadas.length > 0) {
                atendePreco = false;
                faixasPrecoSelecionadas.forEach(indiceFaixa => {
                    if (indiceFaixa === 0 && precoProduto <= 150) atendePreco = true;
                    if (indiceFaixa === 1 && precoProduto > 150 && precoProduto <= 200) atendePreco = true;
                    if (indiceFaixa === 2 && precoProduto > 200) atendePreco = true;
                });
            }

            if (atendeTamanho && atendePreco) {
                card.style.display = "flex";
                produtosVisiveis++;
            } else {
                card.style.display = "none";
            }
        });

        // Atualiza o texto contador de resultados
        if (resultsCountText) {
            resultsCountText.textContent = `${produtosVisiveis} resultado${produtosVisiveis !== 1 ? 's' : ''}`;
        }

        // 3. ORDENAÇÃO (Mudar a ordem física dos elementos no HTML)
        const valorOrdenacao = sortSelect ? sortSelect.value : "Mais Relevantes";
        
        // Criamos uma cópia do array original para não estragar a referência padrão
        const listaParaOrdenar = [...originalProductsArray];

        if (valorOrdenacao === "Menor Preço") {
            listaParaOrdenar.sort((a, b) => {
                return parseFloat(a.getAttribute("data-price")) - parseFloat(b.getAttribute("data-price"));
            });
        } else if (valorOrdenacao === "Maior Preço") {
            listaParaOrdenar.sort((a, b) => {
                return parseFloat(b.getAttribute("data-price")) - parseFloat(a.getAttribute("data-price"));
            });
        }
        // Se for "Mais Relevantes", mantemos a ordem que está em originalProductsArray

        // Aplica a nova ordem reinserindo os elementos no container do grid
        listaParaOrdenar.forEach(card => {
            productsGrid.appendChild(card);
        });
    }
});
