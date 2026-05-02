const API = "https://smsworkers.jorgepronto20.workers.dev";

// ======================= NAVEGAÇÃO =======================
function mostrar(secao) {
  document.querySelectorAll(".secao").forEach(s => s.style.display = "none");
  document.getElementById(secao).style.display = "block";

  if (secao === "modelos") carregarModelos();
  if (secao === "itens") carregarItens();
  if (secao === "colaboradores") carregarColaboradores();
  if (secao === "alertas") carregarAlertas();
}

// ======================= FETCH GENÉRICO =======================
async function api(url, method = "GET", body = null) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(API + url, options);
  return res.json();
}

// ======================= MODELOS =======================
async function carregarModelos() {
  const dados = await api("/modelos");
  const tabela = document.getElementById("tabelaModelos");

  tabela.innerHTML = `
    <tr><th>ID</th><th>Nome</th><th>Código</th><th>Ativo</th><th>Ações</th></tr>
    ${dados.map(m => `
      <tr>
        <td>${m.id}</td>
        <td>${m.nome}</td>
        <td>${m.codigo}</td>
        <td>${m.ativo}</td>
        <td>
          <button onclick="removerModelo(${m.id})">🗑</button>
        </td>
      </tr>
    `).join("")}
  `;
}

document.getElementById("formModelo").onsubmit = async (e) => {
  e.preventDefault();
  await api("/modelos", "POST", {
    nome: modeloNome.value,
    codigo: modeloCodigo.value
  });
  carregarModelos();
};

async function removerModelo(id) {
  await api(`/modelos?id=${id}`, "DELETE");
  carregarModelos();
}

// ======================= ITENS =======================
async function carregarItens() {
  const modeloId = document.getElementById("itemModeloId").value || 1;
  const dados = await api(`/itens?modelo_id=${modeloId}`);
  const tabela = document.getElementById("tabelaItens");

  tabela.innerHTML = `
    <tr><th>ID</th><th>Texto</th><th>Ordem</th><th>Ações</th></tr>
    ${dados.map(i => `
      <tr>
        <td>${i.id}</td>
        <td>${i.texto}</td>
        <td>${i.ordem}</td>
        <td><button onclick="removerItem(${i.id})">🗑</button></td>
      </tr>
    `).join("")}
  `;
}

document.getElementById("formItem").onsubmit = async (e) => {
  e.preventDefault();
  await api("/itens", "POST", {
    modelo_id: itemModeloId.value,
    texto: itemTexto.value,
    ordem: itemOrdem.value
  });
  carregarItens();
};

async function removerItem(id) {
  await api(`/itens?id=${id}`, "DELETE");
  carregarItens();
}

// ======================= COLABORADORES =======================
async function carregarColaboradores() {
  const dados = await api("/colaboradores");
  const tabela = document.getElementById("tabelaColaboradores");

  tabela.innerHTML = `
    <tr><th>ID</th><th>Nome</th><th>PIN</th><th>Ativo</th><th>Ações</th></tr>
    ${dados.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>${c.pin}</td>
        <td>${c.ativo}</td>
        <td><button onclick="removerColaborador(${c.id})">🗑</button></td>
      </tr>
    `).join("")}
  `;
}

document.getElementById("formColaborador").onsubmit = async (e) => {
  e.preventDefault();
  await api("/colaboradores", "POST", {
    nome: colabNome.value,
    pin: colabPin.value
  });
  carregarColaboradores();
};

async function removerColaborador(id) {
  await api(`/colaboradores?id=${id}`, "DELETE");
  carregarColaboradores();
}

// ======================= ALERTAS =======================
async function carregarAlertas() {
  const dados = await api("/alertas");
  const tabela = document.getElementById("tabelaAlertas");

  tabela.innerHTML = `
    <tr><th>ID</th><th>Modelo</th><th>Hora</th><th>Emails</th><th>Ativo</th><th>Ações</th></tr>
    ${dados.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.modelo_id}</td>
        <td>${a.hora_limite}</td>
        <td>${a.emails}</td>
        <td>${a.ativo}</td>
        <td><button onclick="removerAlerta(${a.id})">🗑</button></td>
      </tr>
    `).join("")}
  `;
}

document.getElementById("formAlerta").onsubmit = async (e) => {
  e.preventDefault();
  await api("/alertas", "POST", {
    modelo_id: alertaModeloId.value,
    hora_limite: alertaHora.value,
    emails: alertaEmails.value
  });
  carregarAlertas();
};

async function removerAlerta(id) {
  await api(`/alertas?id=${id}`, "DELETE");
  carregarAlertas();
}

// ======================= INICIAR =======================
mostrar("modelos");
