// index.js

const express = require('express');
const cors = require('cors');
const pool = require('./db');

// Importação das rotas
const clientesRouter = require('./Routes/clientes');
const veiculosRouter = require('./Routes/veiculos');
const ordensReparacaoRouter = require('./Routes/ordens_reparacao');
const orItensRouter = require('./Routes/or_itens');
const marcacoesRouter = require('./Routes/marcacoes');
const fornecedoresRouter = require('./Routes/fornecedores');
const contasCorrentesRouter = require('./Routes/contas_correntes');
const comprasRouter = require('./Routes/compras');
const comprasArtigosRouter = require('./Routes/compras_artigos');
const anexosOrRouter = require('./Routes/anexos_or');
const logAcoesRouter = require('./Routes/log_acoes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('ExpressCar API está funcionando!');
});

// Uso das rotas
app.use('/clientes', clientesRouter);
app.use('/veiculos', veiculosRouter);
app.use('/ordens_reparacao', ordensReparacaoRouter);
app.use('/or_itens', orItensRouter);
app.use('/marcacoes', marcacoesRouter);
app.use('/fornecedores', fornecedoresRouter);
app.use('/contas_correntes', contasCorrentesRouter);
app.use('/compras', comprasRouter);
app.use('/compras_artigos', comprasArtigosRouter);
app.use('/anexos_or', anexosOrRouter);
app.use('/log_acoes', logAcoesRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
