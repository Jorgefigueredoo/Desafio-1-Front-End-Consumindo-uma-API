 async function buscarCEP() {
    const cep = document.getElementById('cep').value;
    const resultado = document.getElementById('resultado');

    if (cep.length !== 8) {
        resultado.innerHTML = "Digite um cep com 8 dígitos";
        return;
    }
    try {
        resultado.innerHTML = "Buscando...";
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) {
            resultado.innerHTML = "CEP não encontrado";
            return;
        }
        resultado.innerHTML = `
            <p><strong>Rua:</strong> ${data.logradouro}</p>
            <p><strong>Bairro:</strong> ${data.bairro}</p>
            <p><strong>Cidade:</strong> ${data.localidade}</p>
            <p><strong>Estado:</strong> ${data.uf}</p>
             `;
    } catch (error) {
        resultado.innerHTML = "Erro ao buscar o CEP";
        console.error(error);
    }
}