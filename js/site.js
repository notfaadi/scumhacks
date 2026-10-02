const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav");
if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const plans = {
  scout: { name: "Scout", length: "24 hours", price: "$19" },
  raider: { name: "Raider", length: "7 days", price: "$49" },
  warden: { name: "Warden", length: "30 days", price: "$89" },
};

const planSelect = document.querySelector("#plan");
const summary = document.querySelector("[data-summary]");
const params = new URLSearchParams(window.location.search);
if (planSelect && params.get("plan") && plans[params.get("plan")]) {
  planSelect.value = params.get("plan");
}

function renderSummary() {
  if (!planSelect || !summary) return;
  const plan = plans[planSelect.value];
  summary.textContent = plan
    ? `${plan.name} · ${plan.length} · ${plan.price}`
    : "Choose a plan";
}
planSelect?.addEventListener("change", renderSummary);
renderSummary();

const form = document.querySelector("[data-request]");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const chosen = data.get("plan");
  const plan = plans[chosen];
  const note = form.querySelector(".note");
  if (note) {
    note.textContent = plan
      ? `Request saved in this browser for ${plan.name} (${plan.price}). This local preview does not take payment and does not send a key.`
      : "Note saved in this browser. Nothing was sent to a server.";
  }
  form.reset();
  if (planSelect && chosen) planSelect.value = chosen;
  renderSummary();
});
