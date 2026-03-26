const form = document.getElementById("cepForm");
const inputCep = document.getElementById("cep");
const resultado = document.getElementById("resultado");
const geoBtn = document.getElementById("geoBtn");
const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;

function formatarCep(valor) {
  let cep = valor.replace(/\D/g, "");

  if (cep.length > 8) {
    cep = cep.slice(0, 8);
  }

  if (cep.length > 5) {
    cep = `${cep.slice(0, 5)}-${cep.slice(5)}`;
  }

  return cep;
}

function mostrarMensagem(mensagem, classe = "") {
  resultado.innerHTML = `<p class="${classe}">${mensagem}</p>`;
}

function mostrarResultado(data) {
  resultado.innerHTML = `
    <p><strong>Rua:</strong> ${data.logradouro || "Não informado"}</p>
    <p><strong>Bairro:</strong> ${data.bairro || "Não informado"}</p>
    <p><strong>Cidade:</strong> ${data.localidade || "Não informado"}</p>
    <p><strong>Estado:</strong> ${data.uf || "Não informado"}</p>
  `;
}

async function buscarCep(cep) {
  if (cep.length !== 8) {
    mostrarMensagem("Digite um CEP com 8 dígitos.", "erro");
    return;
  }

  try {
    mostrarMensagem("Buscando CEP...");

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
      throw new Error("Falha na requisição.");
    }

    const data = await response.json();

    if (data.erro) {
      mostrarMensagem("CEP não encontrado.", "erro");
      return;
    }

    mostrarResultado(data);
  } catch (error) {
    mostrarMensagem("Erro ao buscar o CEP.", "erro");
    console.error(error);
  }
}

inputCep.addEventListener("input", (e) => {
  e.target.value = formatarCep(e.target.value);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cep = inputCep.value.replace(/\D/g, "");
  await buscarCep(cep);
});

geoBtn.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    mostrarMensagem("Geolocalização não suportada neste dispositivo.", "erro");
    return;
  }

  mostrarMensagem("Obtendo sua localização...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      resultado.innerHTML = `
        <p><strong>Localização obtida com sucesso.</strong></p>
        <p><strong>Latitude:</strong> ${latitude.toFixed(5)}</p>
        <p><strong>Longitude:</strong> ${longitude.toFixed(5)}</p>
        <p>
          <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank" rel="noopener noreferrer">
            Abrir no mapa
          </a>
        </p>
      `;
    },
    (error) => {
      mostrarMensagem("Não foi possível obter sua localização.", "erro");
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});

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