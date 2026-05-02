const API = "https://smsworkers.jorgepronto20.workers.dev";

// -----------------------------
// LOGIN
// -----------------------------
async function validarPIN() {
  const pin = document.getElementById("pin").value;
  const msg = document.getElementById("msg");

  if (!pin) {
    msg.textContent = "Insere o PIN.";
    return;
  }

  try {
    const resposta = await fetch(API + "/validar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });

    const dados = await resposta.json();

    if (dados.valido) {
      localStorage.setItem("auth", "ok");
      localStorage.setItem("colaborador_id", dados.id);
      localStorage.setItem("colaborador_nome", dados.nome);
      location.href = "dashboard.html";
    } else {
      msg.textContent = "PIN inválido.";
    }

  } catch (e) {
    msg.textContent = "Erro ao ligar ao servidor.";
  }
}
