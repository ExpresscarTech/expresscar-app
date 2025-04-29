// routes/ordens_reparacao.js
//--------------------------------------------------
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

//--------------------------------------------------
// 1 ▸ LISTAR TODAS AS ORDENS
//--------------------------------------------------
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT orp.*, v.matricula, c.nome AS nome_cliente
         FROM ordens_reparacao  orp
    LEFT JOIN veiculos           v ON v.id_veiculo = orp.id_veiculo
    LEFT JOIN clientes           c ON c.id_cliente = v.id_cliente
     ORDER BY orp.id_or DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar ordens' });
  }
});

//--------------------------------------------------
// 2 ▸ DETALHE DE UMA ORDEM
//--------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT * FROM ordens_reparacao WHERE id_or = $1`, [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'OR não encontrada' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar OR' });
  }
});

//--------------------------------------------------
// 3 ▸ CRIAR NOVA ORDEM
//--------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      id_veiculo,
      km_registado,
      descricao_intervencao,
      revisao = false,
      prioridade = 0
    } = req.body;

    const query = `
      INSERT INTO ordens_reparacao
        (id_veiculo, km_registado, descricao_intervencao,
         revisao, prioridade)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`;
    const params = [
      id_veiculo,
      km_registado,
      descricao_intervencao,
      revisao,
      prioridade
    ];
    const { rows } = await pool.query(query, params);
    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar OR' });
  }
});

module.exports = router;
