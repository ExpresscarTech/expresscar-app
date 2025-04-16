// routes/contas_correntes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar um novo lançamento na conta corrente (Create)
router.post('/', async (req, res) => {
  const { tipo_entidade, id_entidade, data_lancamento, descricao, documento, valor, forma_pagamento, estado, data_pagamento, observacoes } = req.body;
  try {
    const newLancamento = await pool.query(
      `INSERT INTO contas_correntes (tipo_entidade, id_entidade, data_lancamento, descricao, documento, valor, forma_pagamento, estado, data_pagamento, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [tipo_entidade, id_entidade, data_lancamento, descricao, documento, valor, forma_pagamento, estado, data_pagamento, observacoes]
    );
    res.status(201).json(newLancamento.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir lançamento na conta corrente' });
  }
});

// Listar todos os lançamentos (Read All)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contas_correntes ORDER BY id_lancamento ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar lançamentos' });
  }
});

// Obter um lançamento pelo ID (Read One)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM contas_correntes WHERE id_lancamento = $1', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Lançamento não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar lançamento' });
  }
});

// Atualizar um lançamento (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { tipo_entidade, id_entidade, data_lancamento, descricao, documento, valor, forma_pagamento, estado, data_pagamento, observacoes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE contas_correntes SET tipo_entidade = $1, id_entidade = $2, data_lancamento = $3, descricao = $4, documento = $5, valor = $6, forma_pagamento = $7, estado = $8, data_pagamento = $9, observacoes = $10
       WHERE id_lancamento = $11 RETURNING *`,
      [tipo_entidade, id_entidade, data_lancamento, descricao, documento, valor, forma_pagamento, estado, data_pagamento, observacoes, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Lançamento não encontrado para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar lançamento' });
  }
});

// Excluir um lançamento (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM contas_correntes WHERE id_lancamento = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Lançamento não encontrado para exclusão' });
    }
    res.json({ message: 'Lançamento excluído com sucesso', lancamento: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir lançamento' });
  }
});

module.exports = router;
