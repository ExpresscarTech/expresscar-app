// routes/marcacoes.js
//--------------------------------------------------
const express = require('express');
const router  = express.Router();

// ← ATENÇÃO: aqui também deve subir um nível
const pool    = require('../db');

// Criar nova marcação (Create)
router.post('/', async (req, res) => {
  const {
    id_cliente,
    id_veiculo,
    data_marcacao,
    hora_marcacao,
    descricao,
    estado,
    stock_reservado,
    convertida_em_or,
    id_or_gerada,
    observacoes,
    criado_por
  } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO marcacoes
         (id_cliente, id_veiculo, data_marcacao, hora_marcacao,
          descricao, estado, stock_reservado, convertida_em_or,
          id_or_gerada, observacoes, criado_por)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        id_cliente,
        id_veiculo,
        data_marcacao,
        hora_marcacao,
        descricao,
        estado,
        stock_reservado,
        convertida_em_or,
        id_or_gerada,
        observacoes,
        criado_por
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro em marcacoes POST /:', err.message);
    res.status(500).json({ error: 'Erro ao criar marcação' });
  }
});

// Listar todas as marcações (Read All)
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM marcacoes ORDER BY id_marcacao ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro em marcacoes GET /:', err.message);
    res.status(500).json({ error: 'Erro ao buscar marcações' });
  }
});

// GET por ID, PUT e DELETE seguem o mesmo padrão...

module.exports = router;
