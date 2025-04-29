// index.js – ExpressCar API
//--------------------------------------------------
const express = require('express');
const cors    = require('cors');
const pool    = require('./db');        // mantém a pool central

//--------------------------------------------------
// Rotas
//--------------------------------------------------
const clientesRouter        = require('./routes/clientes');
const veiculosRouter        = require('./routes/veiculos');
const ordensRouter          = require('./routes/ordens_reparacao');
const orItensRouter         = require('./routes/or_itens');
const marcacoesRouter       = require('./routes/marcacoes');
const fornecedoresRouter    = require('./routes/fornecedores');
const contasRouter          = require('./routes/contas_correntes');
const comprasRouter         = require('./routes/compras');
const comprasArtigosRouter  = require('./routes/compras_artigos');
const anexosRouter          = require('./routes/anexos_or');
const logAcoesRouter        = require('./routes/log_acoes');

const app  = express();
const port = process.env.PORT || 3000;

//--------------------------------------------------
// Middlewares
//--------------------------------------------------
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => res.send('ExpressCar API operacional!'));

//--------------------------------------------------
// Mount routes
//--------------------------------------------------
app.use('/clientes',         clientesRouter);
app.use('/veiculos',         veiculosRouter);
app.use('/ordens',           ordensRouter);
app.use('/or_itens',         orItensRouter);      // ← ajuste aqui
app.use('/marcacoes',        marcacoesRouter);
app.use('/fornecedores',     fornecedoresRouter);
app.use('/contas_correntes', contasRouter);
app.use('/compras',          comprasRouter);
app.use('/compras_artigos',  comprasArtigosRouter);
app.use('/anexos_or',        anexosRouter);
app.use('/log_acoes',        logAcoesRouter);

//--------------------------------------------------
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
