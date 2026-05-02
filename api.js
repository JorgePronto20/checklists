async function submeterChecklist() {
  const itens = [...document.querySelectorAll(".item")].map(i => i.checked);

  const colaborador_id = localStorage.getItem("colaborador_id");
  const nome = localStorage.getItem("colaborador_nome");

  if (!colaborador_id || !nome) {
    document.getElementById("msg").textContent = "Sessão expirada. Faz login novamente.";
    setTimeout(() => location.href = "login.html", 1500);
    return;
  }

  // Data e hora automáticas
  const agora = new Date();
  const data = agora.toISOString().split("T")[0];
  const hora = agora.toTimeString().split(" ")[0];

  // Tipo de checklist (podes mudar mais tarde)
  const tipo = "abertura";

  try {
    const resposta = await fetch(
      "https://smsworkers.jorgepronto20.workers.dev/checklist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          colaborador_id,
          data,
          hora,
          tipo,
          respostas: itens
        })
      }
    );

    const dados = await resposta.json();

    if (dados.sucesso) {
      document.getElementById("msg").textContent = "Checklist enviada com sucesso!";
    } else {
      document.getElementById("msg").textContent = "Erro ao enviar checklist.";
    }

  } catch (e) {
    document.getElementById("msg").textContent = "Erro de ligação ao servidor.";
    console.error(e);
  }
}
