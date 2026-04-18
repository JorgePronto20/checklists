async function validarPIN() {
  const pin = document.getElementById("pin").value;
  const erro = document.getElementById("erro");

  if (!pin) {
    erro.textContent = "Insere o PIN";
    return;
  }

  try {
    const resposta = await fetch(
      "https://script.google.com/macros/s/AKfycbwxSs_v27UPL9J3UsvCKYFQrBAcJC9fPYWkLfar733rS2GHqgxcdUap5TiXDsxjXUDo/exec?pin=" + pin
    );

    const data = await resposta.json();

    if (data.valido) {
  localStorage.setItem("auth", "ok");
  localStorage.setItem("pin", pin);
  location.href = "dashboard.html";
}
else {
      erro.textContent = "PIN inválido ou inativo";
    }

  } catch (e) {
    erro.textContent = "Erro de ligação à API";
  }
}
