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
  monthly: { name: "Monthly", length: "31 days of access", price: "$35" },
  lifetime: { name: "Lifetime", length: "Unlimited access", price: "$150" },
};

function syncDurationLabels() {
  document.querySelectorAll(".duration-picks").forEach((group) => {
    group.querySelectorAll(".duration").forEach((label) => {
      const input = label.querySelector('input[type="radio"]');
      if (!input) return;
      label.classList.toggle("is-active", input.checked);
    });
  });
}

document.querySelectorAll('.duration-picks input[type="radio"]').forEach((input) => {
  input.addEventListener("change", () => {
    syncDurationLabels();
    const planSelect = document.querySelector("#plan");
    if (planSelect && input.name === "plan") planSelect.value = input.value;
    if (input.name === "plan") renderSummary();
    renderSummary();
    updateBuyLinks();
  });
});
syncDurationLabels();

const planSelect = document.querySelector("#plan");
const summary = document.querySelector("[data-summary]");

function selectedPlanKey() {
  const radio = document.querySelector('.duration-picks input[type="radio"]:checked');
  if (radio) return radio.value;
  if (planSelect) return planSelect.value;
  return "monthly";
}

const params = new URLSearchParams(window.location.search);
const initialPlan = params.get("plan");
if (initialPlan && plans[initialPlan]) {
  if (planSelect) planSelect.value = initialPlan;
  document.querySelectorAll(`input[type="radio"][name="plan"][value="${initialPlan}"]`).forEach((el) => {
    el.checked = true;
  });
  syncDurationLabels();
}

function renderSummary() {
  if (!summary) return;
  const key = selectedPlanKey();
  const plan = plans[key];
  summary.textContent = plan ? `${plan.name} · ${plan.length} · ${plan.price}` : "Choose a duration";
}

function updateBuyLinks() {
  const key = document.querySelector('.duration-picks input[type="radio"]:checked')?.value || "monthly";
  document.querySelectorAll("[data-checkout-plan]").forEach((link) => {
    link.setAttribute("href", `/checkout.html?plan=${key}`);
  });
  const priceEl = document.querySelector("[data-live-price]");
  if (priceEl && plans[key]) priceEl.textContent = plans[key].price;
}

planSelect?.addEventListener("change", () => {
  const val = planSelect.value;
  document.querySelectorAll(`input[type="radio"][name="plan"][value="${val}"]`).forEach((el) => {
    el.checked = true;
  });
  syncDurationLabels();
  renderSummary();
});
renderSummary();
updateBuyLinks();

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
  const keep = chosen || "monthly";
  form.reset();
  if (planSelect) planSelect.value = keep;
  document.querySelectorAll(`input[type="radio"][name="plan"][value="${keep}"]`).forEach((el) => {
    el.checked = true;
  });
  syncDurationLabels();
  renderSummary();
});

const menuPanels = {
  visuals: [
    { label: "Player ESP", on: true },
    { label: "Box", on: true },
    { label: "Skeleton", on: true },
    { label: "Glow", on: false },
    { label: "Health", on: true },
    { label: "Armor", on: true },
    { label: "Distance", on: true },
    { label: "Team Check", on: true },
    { label: "Max Distance", slider: "300m", value: 60 },
  ],
  aimbot: [
    { label: "Player Aimbot", on: true },
    { label: "Zombie Aimbot", on: false },
    { label: "Visible Check", on: true },
    { label: "Draw FOV Border", on: true },
    { label: "Smooth", slider: "4.2", value: 42 },
    { label: "FOV Radius", slider: "90°", value: 50 },
  ],
  misc: [
    { label: "Crosshair", on: true },
    { label: "Menu Language", on: true },
    { label: "FPS Limit", slider: "144", value: 72 },
    { label: "No Recoil (Risk)", on: false },
    { label: "No Spread (Risk)", on: false },
    { label: "Unlimited Ammo (Risk)", on: false },
  ],
};

const preview = document.querySelector("[data-menu-preview]");
if (preview) {
  const tabs = preview.querySelectorAll("[data-menu-tab]");
  const list = preview.querySelector("[data-menu-list]");
  const title = preview.querySelector("[data-menu-title]");

  function renderMenu(tab) {
    const rows = menuPanels[tab] || [];
    if (title) title.textContent = tab === "visuals" ? "Visuals" : tab === "aimbot" ? "Aimbot" : "Misc";
    if (!list) return;
    list.innerHTML = rows
      .map((row) => {
        if (row.slider) {
          return `<div class="menu-row"><span>${row.label}</span><span class="menu-val">${row.slider}</span></div>
            <div class="menu-slider" style="--pct:${row.value}%"><i></i></div>`;
        }
        return `<div class="menu-row"><span>${row.label}</span><span class="toggle ${row.on ? "on" : ""}" aria-hidden="true"><i></i></span></div>`;
      })
      .join("");
  }

  tabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabBtn.classList.add("active");
      renderMenu(tabBtn.dataset.menuTab);
    });
  });
  renderMenu("visuals");
}

document.querySelectorAll(".marquee-track[data-fill]").forEach((track) => {
  if (track.dataset.filled === "true") return;
  track.innerHTML += track.innerHTML;
  track.dataset.filled = "true";
});
