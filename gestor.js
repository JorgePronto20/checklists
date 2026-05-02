const API = "https://smsworkers.jorgepronto20.workers.dev";

// -----------------------------
// ADICIONAR COLABORADOR
// -----------------------------
async function adicionar() {
  const nome = document.getElementById("nome").value;
  const pin = document.getElementById("pin").value;
  const msg = document.getElementById("msg");

  if (!nome || !pin) {
    msg.textContent = "Preenche todos os campos.";
    return;
  }

  const resposta = await fetch(API + "/colaboradores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, pin })
  });

  const dados = await resposta.json();

  if (dados.sucesso) {
    msg.textContent = "Colaborador adicionado!";
    carregarLista();
  } else {
    msg.textContent = "Erro: " + dados.erro;
  }
}

// -----------------------------
// LISTAR COLABORADORES
// -----------------------------
async function carregarLista() {
  const resposta = await fetch(API + "/colaboradores");
  const lista = await resposta.json();

  document.getElementById("lista").innerHTML = lista
    .map(c => `
      <div class="card">
        <p><strong>${c.nome}</strong> (PIN: ${c.pin})</p>
        <button onclick="remover(${c.id})">Remover</button>
      </div>
    `)
    .join("");
}

// -----------------------------
// REMOVER COLABORADOR
// -----------------------------
async function remover(id) {
  await fetch(API + "/colaboradores?id=" + id, {
    method: "DELETE"
  });

  carregarLista();
}

carregarLista();
