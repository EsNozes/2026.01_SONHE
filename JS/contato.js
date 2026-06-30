document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("whatsappForm");

    if (form) {
        form.addEventListener("submit", (event) => {
            // Evita que a página recarregue
            event.preventDefault();

            // Captura o nome digitado para personalizar o agradecimento
            const nome = document.getElementById("name").value.trim();

            // Exibe a mensagem de sucesso na tela
            alert(`Obrigado pelo contato, ${nome}! Sua mensagem foi enviada com sucesso para a nossa equipe de vendas.`);
            
            // Limpa os campos do formulário após clicar em "OK"
            form.reset();
        });
    }
});
