const form = document.getElementById("cepForm");
const inputCep = document.getElementById("cep");
const resultado = document.getElementById("resultado");

inputCep.addEventListener("input", (e) => {
  let valor = e.target.value.replace(/\D/g, "");

  if (valor.length > 8) {
    valor = valor.slice(0, 8);
  }

  if (valor.length > 5) {
    valor = `${valor.slice(0, 5)}-${valor.slice(5)}`;
  }

  e.target.value = valor;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cep = inputCep.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    resultado.innerHTML = `<p class="erro">Digite um CEP com 8 dígitos.</p>`;
    return;
  }

  try {
    resultado.innerHTML = `<p>Buscando CEP...</p>`;

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!response.ok) {
      throw new Error("Falha na requisição.");
    }

    const data = await response.json();

    if (data.erro) {
      resultado.innerHTML = `<p class="erro">CEP não encontrado.</p>`;
      return;
    }

    resultado.innerHTML = `
      <p><strong>Rua:</strong> ${data.logradouro || "Não informado"}</p>
      <p><strong>Bairro:</strong> ${data.bairro || "Não informado"}</p>
      <p><strong>Cidade:</strong> ${data.localidade || "Não informado"}</p>
      <p><strong>Estado:</strong> ${data.uf || "Não informado"}</p>
    `;
  } catch (error) {
    resultado.innerHTML = `<p class="erro">Erro ao buscar o CEP.</p>`;
    console.error(error);
  }
});