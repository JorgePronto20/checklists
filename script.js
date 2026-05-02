<script>
async function validarPIN() {
    const pin = document.getElementById("pin").value;

    if (!pin) {
        alert("Introduz o PIN");
        return;
    }

    try {
        const resposta = await fetch("https://smsworkers.jorgepronto20.workers.dev/validar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pin })
        });

        const dados = await resposta.json();

        if (dados.valido) {
            // Guardar info do colaborador
            localStorage.setItem("colaborador_id", dados.id);
            localStorage.setItem("colaborador_nome", dados.nome);

            // Redirecionar para o dashboard
            window.location.href = "dashboard.html";
        } else {
            alert("PIN inválido");
        }

    } catch (erro) {
        alert("Erro ao validar PIN: " + erro);
    }
}
</script>
