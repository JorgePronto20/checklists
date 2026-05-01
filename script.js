async function validarPIN() {
  const pin = document.getElementById("pin").value;

  if (!pin || pin.length !== 4) {
    document.getElementById("erro").textContent = "Insere um PIN válido";
    return;
  }

  try {
    const resposta = await fetch(
      "https://smsworkers.jorgepronto20.workers.dev/validar?pin=" + pin
    );

    const dados = await resposta.json();

    if (dados.valido) {
      localStorage.setItem("pin", pin);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("erro").textContent = "PIN inválido";
    }

  } catch (e) {
    document.getElementById("erro").textContent = "Erro de ligação à API";
  }
}
