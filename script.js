console.log("script carregado");

const form = document.getElementById("formOrcamento");
const resultado = document.getElementById("resultado");
const cardsHistorico = document.getElementById("cardsHistorico");

const servicoNome = {
  oleo: "Troca de Óleo",
  freios: "Revisão de Freios",
  suspensao: "Suspensão",
};
const veiculoNome = { leve: "Carro Leve", pesado: "Veículo Pesado" };

let historico = JSON.parse(localStorage.getItem("historico")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const servico = document.getElementById("servico").value;
  const veiculo = document.getElementById("veiculo").value;
  const lavagem = document.getElementById("lavagem").checked;

  if (!servico || !veiculo) {
    resultado.innerHTML = "Preencha todos os campos.";
    return;
  }

  let preco = calcularPreco(servico, veiculo, lavagem);

  const orcamento = {
    servico: servicoNome[servico],
    veiculo: veiculoNome[veiculo],
    lavagem: lavagem ? "Sim" : "Não",
    total: preco,
  };

  historico.push(orcamento);
  localStorage.setItem("historico", JSON.stringify(historico));

  mostrarResultado(orcamento);
  mostrarHistorico();
});

function calcularPreco(servico, veiculo, lavagem) {
  let preco = 0;
  if (servico === "oleo") preco += 100;
  if (servico === "freios") preco += 150;
  if (servico === "suspensao") preco += 200;

  if (veiculo === "pesado") preco *= 1.5;
  if (lavagem) preco += 30;

  return preco;
}

function mostrarResultado(orcamento) {
  let classeTotal = "total-baixo";
  if (orcamento.total > 250) classeTotal = "total-alto";
  else if (orcamento.total > 150) classeTotal = "total-medio";

  resultado.innerHTML = `
    <h3>Resumo do Orçamento:</h3>
    <p><strong>Serviço:</strong> ${orcamento.servico}</p>
    <p><strong>Tipo de Veículo:</strong> ${orcamento.veiculo}</p>
    <p><strong>Lavagem:</strong> ${orcamento.lavagem}</p>
    <p><strong>Total estimado:</strong> <span class="${classeTotal}">R$ ${orcamento.total.toFixed(
    2
  )}</span></p>
  `;
}

function mostrarHistorico() {
  cardsHistorico.innerHTML = "";
  historico
    .slice()
    .reverse()
    .forEach((item) => {
      let classeTotal = "total-baixo";
      if (item.total > 250) classeTotal = "total-alto";
      else if (item.total > 150) classeTotal = "total-medio";

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
      <p><strong>Serviço:</strong> ${item.servico}</p>
      <p><strong>Veículo:</strong> ${item.veiculo}</p>
      <p><strong>Lavagem:</strong> ${item.lavagem}</p>
      <p><strong>Total:</strong> <span class="${classeTotal}">R$ ${item.total.toFixed(
        2
      )}</span></p>
    `;
      cardsHistorico.appendChild(card);
    });
}

// Exibe histórico existente ao carregar a página
mostrarHistorico();
const btnLimpar = document.getElementById("limparHistorico");

btnLimpar.addEventListener("click", () => {
  if (confirm("Deseja realmente limpar todo o histórico?")) {
    historico = [];
    localStorage.removeItem("historico");
    cardsHistorico.innerHTML = "";
  }
});
