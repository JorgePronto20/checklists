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
// LISTAR + PESQUISAR
// -----------------------------
async function carregarLista() {
  const q = document.getElementById("pesquisa")?.value || "";

  const resposta = await fetch(API + "/colaboradores?q=" + encodeURIComponent(q));
  const lista = await resposta.json();

  document.getElementById("lista").innerHTML = lista
    .map(c => `
      <div class="card">
        <p><strong>ID:</strong> ${c.id}</p>
        <p><strong>Nome:</strong> <input id="nome_${c.id}" value="${c.nome}"></p>
        <p><strong>PIN:</strong> <input id="pin_${c.id}" value="${c.pin}" maxlength="4"></p>

        <p><strong>Ativo:</strong>
          <select id="ativo_${c.id}">
            <option value="1" ${c.ativo == 1 ? "selected" : ""}>Ativo</option>
            <option value="0" ${c.ativo == 0 ? "selected" : ""}>Inativo</option>
          </select>
        </p>

        <button onclick="editar(${c.id})">Guardar</button>
        <button onclick="remover(${c.id})" style="background:#b33">Remover</button>
      </div>
    `)
    .join("");
}



// -----------------------------
// EDITAR COLABORADOR
// -----------------------------
async function editar(id) {
  const nome = document.getElementById("nome_" + id).value;
  const pin = document.getElementById("pin_" + id).value;
  const ativo = document.getElementById("ativo_" + id).value;

  const resposta = await fetch(API + "/colaboradores", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, nome, pin, ativo })
  });

  const dados = await resposta.json();

  if (dados.sucesso) {
    alert("Colaborador atualizado!");
    carregarLista();
  } else {
    alert("Erro: " + dados.erro);
  }
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
