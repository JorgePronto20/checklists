async function submeterChecklist() {
  const itens = [...document.querySelectorAll(".item")].map(i => i.checked);
  const pin = localStorage.getItem("pin");

  const resposta = await fetch(
    "https://script.google.com/macros/s/AKfycbwxSs_v27UPL9J3UsvCKYFQrBAcJC9fPYWkLfar733rS2GHqgxcdUap5TiXDsxjXUDo/exec",
    {
      method: "POST",
      body: JSON.stringify({ itens, pin })
    }
  );

  document.getElementById("msg").textContent = "Checklist enviada!";
}
