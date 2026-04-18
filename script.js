function validarPIN() {
  const pin = document.getElementById("pin").value;
  const erro = document.getElementById("erro");
  if (pin === "2121") {
    window.location.href = "dashboard.html";
  } else {
    erro.textContent = "PIN inválido";
  }
}
