// ======================
// CONTROLE DAS ETAPAS
// ======================
const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next");
const prevBtns = document.querySelectorAll(".prev");
const progress = document.querySelector(".progress");

let currentStep = 0;

function updateSteps() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  progress.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
}

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const currentFields = steps[currentStep].querySelectorAll("input, textarea");

    let valid = true;

    currentFields.forEach(field => {
      field.classList.remove("input-error");

      // valida inputs normais
      if (field.type !== "radio" && field.hasAttribute("required") && !field.value.trim()) {
        field.classList.add("input-error");
        valid = false;
      }

      // valida radio
      if (field.type === "radio") {
        const checked = steps[currentStep].querySelector(`input[name="${field.name}"]:checked`);
        if (!checked) valid = false;
      }
    });

    if (!valid) return;

    currentStep++;
    updateSteps();
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentStep--;
    updateSteps();
  });
});


// ======================
// MODAL
// ======================
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

function showModal() {
  modal.classList.add("show");
}

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});


// ======================
// ENVIO COM FORMSPREE
// ======================
const form = document.getElementById("form");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  let valid = true;

  const nome = document.getElementById("nome");
  const telefone = document.getElementById("telefone");
  const motivo = document.querySelector('input[name="motivo"]:checked');

  [nome, telefone].forEach(el => el.classList.remove("input-error"));

  if (!nome.value.trim()) {
    nome.classList.add("input-error");
    valid = false;
  }

  if (!telefone.value.trim()) {
    telefone.classList.add("input-error");
    valid = false;
  }

  if (!motivo) {
    valid = false;
    document.querySelectorAll('.options label').forEach(label => {
      label.style.border = "1px solid #ff4d4d";
    });
  }

  if (!valid) return;

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      showModal();
      form.reset();
      currentStep = 0;
      updateSteps();
    } else {
      alert("Erro ao enviar. Tente novamente.");
    }

  } catch (error) {
    alert("Erro de conexão.");
  }
});