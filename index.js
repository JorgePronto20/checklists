export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // -----------------------------
    // ENDPOINTS
    // -----------------------------

    // Validar PIN
    if (url.pathname === "/validar" && request.method === "POST") {
      return validarPIN(request, env);
    }

    // Guardar checklist
    if (url.pathname === "/checklist" && request.method === "POST") {
      return guardarChecklist(request, env);
    }

    // Listar checklists
    if (url.pathname === "/listar" && request.method === "GET") {
      return listarChecklists(request, env);
    }

    // Default
    return new Response("SMS Workers ativo", { status: 200 });
  }
};



// ======================================================
// FUNÇÃO: VALIDAR PIN
// ======================================================
async function validarPIN(request, env) {
  try {
    const { pin } = await request.json();

    if (!pin) {
      return json({ erro: "PIN em falta" }, 400);
    }

    const stmt = env.smsdb
      .prepare("SELECT id, nome FROM colaboradores WHERE pin = ?")
      .bind(pin);

    const colaborador = await stmt.first();

    if (!colaborador) {
      return json({ valido: false });
    }

    return json({
      valido: true,
      id: colaborador.id,
      nome: colaborador.nome
    });

  } catch (err) {
    return json({ erro: err.message }, 500);
  }
}



// ======================================================
// FUNÇÃO: GUARDAR CHECKLIST
// ======================================================
async function guardarChecklist(request, env) {
  try {
    const { colaborador_id, data, hora, tipo, respostas } = await request.json();

    if (!colaborador_id || !data || !hora || !tipo || !respostas) {
      return json({ erro: "Dados em falta" }, 400);
    }

    const stmt = env.smsdb
      .prepare(
        "INSERT INTO checklists (colaborador_id, data, hora, tipo, respostas) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(colaborador_id, data, hora, tipo, JSON.stringify(respostas));

    await stmt.run();

    return json({ sucesso: true });

  } catch (err) {
    return json({ erro: err.message }, 500);
  }
}



// ======================================================
// FUNÇÃO: LISTAR CHECKLISTS
// ======================================================
async function listarChecklists(request, env) {
  try {
    const url = new URL(request.url);
    const colaborador_id = url.searchParams.get("colaborador_id");
    const data = url.searchParams.get("data");

    let query = "SELECT * FROM checklists WHERE 1=1";
    const params = [];

    if (colaborador_id) {
      query += " AND colaborador_id = ?";
      params.push(colaborador_id);
    }

    if (data) {
      query += " AND data = ?";
      params.push(data);
    }

    const stmt = env.smsdb.prepare(query).bind(...params);
    const resultados = await stmt.all();

    return json(resultados);

  } catch (err) {
    return json({ erro: err.message }, 500);
  }
}



// ======================================================
// HELPER PARA RESPOSTAS JSON
// ======================================================
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
