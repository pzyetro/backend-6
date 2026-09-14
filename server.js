const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir leitura em JSON em req.body
app.use(express.json());

// BANCO DE DADOS EM MEMÓRIA
let impressoes = [
  {
    id: 1,
    cliente: "Carlos Eduardo Silva",
    tipoPapel: "Couchê",
    quantidade: 1000,
    prazo: "2026-10-15",
    acabamentos: ["Laminação Fosca"]
  },
  {
    id: 2,
    cliente: "Ana Beatriz Ramos",
    tipoPapel: "Sulfite",
    quantidade: 500,
    prazo: "2026-10-18",
    acabamentos: ["Corte Vinco"]
  },
  {
    id: 3,
    cliente: "Lucas Gabriel Ferreira",
    tipoPapel: "Reciclato",
    quantidade: 250,
    prazo: "2026-10-20",
    acabamentos: ["Verniz"]
  }
];




// ROTA 1: GET /impressoes (listar todos os impressoes) status 200 ok
app.get('/impressoes', (req, res) => {
  return res.status(200).json(impressoes);
});
// ROTA 2: GET /impressoes/:id (Buscar uma impressão específica pelo ID) - 200 OK ou 404
app.get('/impressoes/:id', (req, res) => {
  const { id } = req.params; // Extrai o ID da URL

  // Procura a impressão no array em memória
  const impressao = impressoes.find(p => p.id === parseInt(id));

  // Caso não exista, retorna 404 Not Found
  if (!impressao) {
    return res.status(404).json({ mensagem: 'Impressão não encontrada.' });
  }

  // Se existir, retorna 200 OK com os dados encontrados
  return res.status(200).json(impressao);
});
// ROTA 3: POST /impressoes (Cadastrar uma Nova Impressão) - 201 Created (req.body)
app.post('/impressoes', (req, res) => {
  // Extrai as informações enviadas pelo cliente no corpo (body) da requisição
  const { cliente, tipoPapel, quantidade, prazo } = req.body;

// Validação simples dos dados recebidos
  if (!cliente || !tipoPapel || quantidade === undefined || !prazo) {
    return res.status(400).json({ mensagem: 'cliente, tipoPapel, quantidade e prazo são obrigatórios.' });
  }

  // Criação de novo registro com identificador único incremental
  const novaImpressao = {
    id: impressoes.length > 0 ? impressoes[impressoes.length - 1].id + 1 : 1,
    cliente,
    tipoPapel,
    quantidade: Number(quantidade),
    prazo,
    acabamentos: []
  };

  impressoes.push(novaImpressao);

  // RESTful: Retorna HTTP Status 201 Created + Objeto Criado
  return res.status(201).json({
    mensagem: 'Impressão cadastrada com sucesso!',
    impressao: novaImpressao
  });
});

// ROTA 4: PUT /impressoes/:id (Atualizar uma Impressão Existente) - 200 OK (req.params + req.body)
app.put('/impressoes/:id', (req, res) => {
  const { id } = req.params; // ID na URL
  const { cliente, tipoPapel, quantidade, prazo } = req.body; // Novos dados no Body

  // Localiza a posição da impressão no array
  const index = impressoes.findIndex(p => p.id === parseInt(id));

  // Caso a impressão não exista no banco/memória
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Impressão não encontrada para atualização.' });
  }

  // Atualiza os dados mantendo o ID e os acabamentos originais
  impressoes[index] = {
    ...impressoes[index],
    cliente: cliente || impressoes[index].cliente,
    tipoPapel: tipoPapel || impressoes[index].tipoPapel,
    quantidade: quantidade !== undefined ? Number(quantidade) : impressoes[index].quantidade,
    prazo: prazo || impressoes[index].prazo
  };

  // Retorna HTTP Status 200 OK com o registro atualizado
  return res.status(200).json({
    mensagem: 'Impressão atualizada com sucesso!',
    impressao: impressoes[index]
  });
});

// ROTA 5: DELETE /impressoes/:id (Deletar uma Impressão pelo ID) - 200 OK (req.params)
app.delete('/impressoes/:id', (req, res) => {
  const { id } = req.params;

  // Encontra a posição do item
  const index = impressoes.findIndex(p => p.id === parseInt(id));

  // Se não existir, retorna 404 Not Found
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Impressão não encontrada para exclusão.' });
  }

  // Remove o elemento do array em memória
  impressoes.splice(index, 1);

  // Retorna HTTP Status 200 OK com mensagem de confirmação
  return res.status(200).json({
    mensagem: `Impressão com ID ${id} removida com sucesso!`
  });
});

// DESAFIO SUB-RECURSO: POST /impressoes/:id/acabamentos
app.post('/impressoes/:id/acabamentos', (req, res) => {
  const { id } = req.params;
  const { acabamento } = req.body;

  const impressao = impressoes.find(p => p.id === parseInt(id));

  if (!impressao) {
    return res.status(404).json({ mensagem: 'Impressão não encontrada.' });
  }

  if (!acabamento) {
    return res.status(400).json({ mensagem: 'O campo acabamento é obrigatório.' });
  }

  impressao.acabamentos.push(acabamento);

  return res.status(201).json({
    mensagem: 'Acabamento adicionado com sucesso!',
    impressao
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`🚀 [SERVIDOR ATIVO] Rodando em http://localhost:${PORT}`);
  console.log(`Pronto para receber requisições do Thunder Client!`);
});