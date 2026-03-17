# 🔍 Busca CEP

Aplicação web simples para consultar informações de endereço a partir de um CEP brasileiro, utilizando a API pública do **ViaCEP**.

## 📸 Preview

![Busca CEP](https://i.ytimg.com/vi/RQkthiy0oMM/hqdefault.jpg)

## ✨ Funcionalidades

- 🔎 Consulta de endereço pelo CEP
- 📋 Exibição de rua, bairro, cidade e estado
- ✅ Validação de CEP com 8 dígitos
- ❌ Mensagem de erro para CEP inválido ou não encontrado

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| HTML | Estrutura da página |
| CSS | Estilização e layout |
| JavaScript | Lógica e requisições |
| [ViaCEP API](https://viacep.com.br/) | Consulta de CEPs |

## 📁 Estrutura do Projeto
```
busca-cep/
├── index.html    # Página principal
├── style.css     # Estilos
└── script.js     # Lógica de busca
```

## 🚀 Como usar

1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` no navegador
3. Digite um CEP válido (somente números) no campo de busca
4. Clique em **Buscar CEP**
5. O endereço correspondente será exibido na tela

> Não é necessária nenhuma instalação ou dependência externa.

## ⚙️ Como funciona

A aplicação remove caracteres não numéricos do CEP digitado, valida se possui 8 dígitos e faz uma requisição `GET` para a API do ViaCEP. Os dados retornados (logradouro, bairro, cidade e UF) são renderizados dinamicamente na página.

## 📡 API utilizada

**ViaCEP** — API pública e gratuita para consulta de CEPs brasileiros.  
Documentação: [https://viacep.com.br/](https://viacep.com.br/)

Exemplo de requisição:
```
GET https://viacep.com.br/ws/01310100/json/
```

Exemplo de resposta:
```json
{
  "logradouro": "Avenida Paulista",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP"
}
```
