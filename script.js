const form = document.getElementById("cepForm");
const inputCep = document.getElementById("cep");
const resultado = document.getElementById("resultado");
const geoBtn = document.getElementById("geoBtn");
const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;

// === Partículas flutuantes no fundo ===
function criarParticulas() {
  const container = document.createElement("div");
  container.className = "particulas";
  document.body.appendChild(container);

  for (let i = 0; i < 25; i++) {
    const p = document.createElement("span");
    p.className = "particula";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 12 + "s";
    p.style.animationDelay = Math.random() * 8 + "s";
    p.style.width = p.style.height = 2 + Math.random() * 4 + "px";
    p.style.opacity = 0.15 + Math.random() * 0.3;
    container.appendChild(p);
  }
}
criarParticulas();

// === Formatação do CEP ===
function formatarCep(valor) {
  let cep = valor.replace(/\D/g, "");
  if (cep.length > 8) cep = cep.slice(0, 8);
  if (cep.length > 5) cep = `${cep.slice(0, 5)}-${cep.slice(5)}`;
  return cep;
}

// === Mensagens com animação ===
function mostrarMensagem(mensagem, classe = "") {
  resultado.innerHTML = `<p class="${classe}">${mensagem}</p>`;
}

function mostrarLoading(texto) {
  resultado.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>${texto}</p>
    </div>
  `;
}

function mostrarResultado(data) {
  const campos = [
    { label: "Rua", valor: data.logradouro, icone: "📍" },
    { label: "Bairro", valor: data.bairro, icone: "🏘️" },
    { label: "Cidade", valor: data.localidade, icone: "🏙️" },
    { label: "Estado", valor: data.uf, icone: "🗺️" },
  ];

  resultado.innerHTML = campos
    .map(
      (c, i) => `
      <div class="resultado-item" style="animation-delay: ${i * 0.1}s">
        <span class="resultado-icone">${c.icone}</span>
        <div>
          <span class="resultado-label">${c.label}</span>
          <span class="resultado-valor">${c.valor || "Não informado"}</span>
        </div>
      </div>`
    )
    .join("");
}

// === Efeito de shake no input (erro) ===
function shakeInput() {
  inputCep.classList.add("shake");
  inputCep.addEventListener("animationend", () => {
    inputCep.classList.remove("shake");
  }, { once: true });
}

// === Efeito de sucesso no botão ===
function feedbackBotao(btn, sucesso) {
  const classe = sucesso ? "btn-sucesso" : "btn-erro";
  btn.classList.add(classe);
  setTimeout(() => btn.classList.remove(classe), 1500);
}

// === Buscar CEP ===
async function buscarCep(cep, btnOrigem) {
  if (cep.length !== 8) {
    mostrarMensagem("Digite um CEP com 8 dígitos.", "erro");
    shakeInput();
    return;
  }
  try {
    mostrarLoading("Buscando CEP...");
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error("Falha na requisição.");
    const data = await response.json();
    if (data.erro) {
      mostrarMensagem("CEP não encontrado.", "erro");
      shakeInput();
      if (btnOrigem) feedbackBotao(btnOrigem, false);
      return;
    }
    mostrarResultado(data);
    if (btnOrigem) feedbackBotao(btnOrigem, true);
  } catch (error) {
    mostrarMensagem("Erro ao buscar o CEP.", "erro");
    shakeInput();
    if (btnOrigem) feedbackBotao(btnOrigem, false);
    console.error(error);
  }
}

// === Máscara do input ===
inputCep.addEventListener("input", (e) => {
  e.target.value = formatarCep(e.target.value);
});

// === Efeito visual ao focar no input ===
inputCep.addEventListener("focus", () => {
  inputCep.parentElement.classList.add("form-focada");
});
inputCep.addEventListener("blur", () => {
  inputCep.parentElement.classList.remove("form-focada");
});

// === Submit do formulário ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = "Buscando...";
  const cep = inputCep.value.replace(/\D/g, "");
  await buscarCep(cep, btn);
  btn.disabled = false;
  btn.textContent = "Buscar CEP";
});

// === Geolocalização ===
geoBtn.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    mostrarMensagem("Geolocalização não suportada neste dispositivo.", "erro");
    return;
  }

  geoBtn.disabled = true;
  geoBtn.textContent = "Localizando...";
  mostrarLoading("Obtendo sua localização...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      mostrarLoading("Convertendo localização em CEP...");

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
        );

        if (!response.ok) throw new Error("Falha na requisição.");

        const data = await response.json();
        const cepBruto = data.postcode || "";
        const cep = cepBruto.replace(/\D/g, "");

        if (cep.length === 8) {
          inputCep.value = formatarCep(cep);
          await buscarCep(cep, geoBtn);
        } else {
          resultado.innerHTML = `
            <div class="resultado-item" style="animation-delay: 0s">
              <span class="resultado-icone">⚠️</span>
              <div>
                <span class="resultado-label">Aviso</span>
                <span class="resultado-valor">CEP não disponível para esta área</span>
              </div>
            </div>
            <div class="resultado-item" style="animation-delay: 0.1s">
              <span class="resultado-icone">🏘️</span>
              <div>
                <span class="resultado-label">Bairro</span>
                <span class="resultado-valor">${data.locality || "Não informado"}</span>
              </div>
            </div>
            <div class="resultado-item" style="animation-delay: 0.2s">
              <span class="resultado-icone">🏙️</span>
              <div>
                <span class="resultado-label">Cidade</span>
                <span class="resultado-valor">${data.city || "Não informado"}</span>
              </div>
            </div>
            <div class="resultado-item" style="animation-delay: 0.3s">
              <span class="resultado-icone">🗺️</span>
              <div>
                <span class="resultado-label">Estado</span>
                <span class="resultado-valor">${data.principalSubdivision || "Não informado"}</span>
              </div>
            </div>
            <a class="mapa-link" href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank" rel="noopener noreferrer">
              📌 Abrir no Google Maps
            </a>
          `;
        }
      } catch (error) {
        mostrarMensagem("Não foi possível converter a localização em endereço.", "erro");
        feedbackBotao(geoBtn, false);
        console.error(error);
      }

      geoBtn.disabled = false;
      geoBtn.textContent = "Usar minha localização";
    },
    (error) => {
      mostrarMensagem("Não foi possível obter sua localização.", "erro");
      feedbackBotao(geoBtn, false);
      geoBtn.disabled = false;
      geoBtn.textContent = "Usar minha localização";
      console.error(error);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});

// === Instalação PWA ===
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registrado com sucesso.");
    } catch (error) {
      console.error("Erro ao registrar o Service Worker:", error);
    }
  });
}
