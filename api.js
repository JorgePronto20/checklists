async function submeter(tipo) {
  const itens = [...document.querySelectorAll(".item")].map(i => i.checked);

  const colaborador_id = localStorage.getItem("colaborador_id");
  const nome = localStorage.getItem("colaborador_nome");

  if (!colaborador_id) {
    document.getElementById("msg").textContent = "Sessão expirada.";
    location.href = "login.html";
    return;
  }

  const agora = new Date();
  const data = agora.toISOString().split("T")[0];
  const hora = agora.toTimeString().split(" ")[0];

  const resposta = await fetch(
    "https://smsworkers.jorgepronto20.workers.dev/checklist",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    document.getElementById("msg").textContent = "Checklist enviada!";
  } else {
    document.getElementById("msg").textContent = "Erro ao enviar.";
  }
}
