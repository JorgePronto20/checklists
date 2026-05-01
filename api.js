async function submeterChecklist() {
  const itens = [...document.querySelectorAll(".item")].map(i => i.checked);
  const pin = localStorage.getItem("pin");

  const resposta = await fetch(
    "https://smsworkers.jorgepronto20.workers.dev",
    {
      method: "POST",
      body: JSON.stringify({ itens, pin })
    }
  );

  document.getElementById("msg").textContent = "Checklist enviada!";
}
