// index.js – ExpressCar API
//--------------------------------------------------
const path    = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env.development')
});

const express = require('express');
const cors    = require('cors');
const pool    = require('./db');        // pool de ligações

// Routers
const clientesRouter     = require('./Routes/clientes');
const veiculosRouter     = require('./Routes/veiculos');
const ordensRouter       = require('./Routes/ordens_reparacao');
const marcacoesRouter    = require('./Routes/marcacoes');
const fornecedoresRouter = require('./Routes/fornecedores');
const contasRouter       = require('./Routes/contas_correntes');
const comprasRouter      = require('./Routes/compras');
const comprasArtRouter   = require('./Routes/compras_artigos');
const anexosRouter       = require('./Routes/anexos_or');
const logAcoesRouter     = require('./Routes/log_acoes');
const artigosRouter      = require('./Routes/artigos');

const app  = express();
const port = Number(process.env.PORT) || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => res.send('ExpressCar API operacional!'));

// Mount routes
app.use('/clientes',         clientesRouter);
app.use('/veiculos',         veiculosRouter);
app.use('/ordens',           ordensRouter);
app.use('/marcacoes',        marcacoesRouter);
app.use('/fornecedores',     fornecedoresRouter);
app.use('/contas_correntes', contasRouter);
app.use('/compras',          comprasRouter);
app.use('/compras_artigos',  comprasArtRouter);
app.use('/anexos_or',        anexosRouter);
app.use('/log_acoes',        logAcoesRouter);
app.use('/artigos',          artigosRouter);

// Start
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
