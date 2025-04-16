// routes/marcacoes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar nova marcação (Create)
router.post('/', async (req, res) => {
  const { id_cliente, id_veiculo, data_marcacao, hora_marcacao, descricao, estado, stock_reservado, convertida_em_or, id_or_gerada, observacoes, criado_por } = req.body;
  try {
    const newMarcacao = await pool.query(
      `INSERT INTO marcacoes (id_cliente, id_veiculo, data_marcacao, hora_marcacao, descricao, estado, stock_reservado, convertida_em_or, id_or_gerada, observacoes, criado_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [id_cliente, id_veiculo, data_marcacao, hora_marcacao, descricao, estado, stock_reservado, convertida_em_or, id_or_gerada, observacoes, criado_por]
    );
    res.status(201).json(newMarcacao.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao criar marcação' });
  }
});

// Listar todas as marcações (Read All)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marcacoes ORDER BY id_marcacao ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar marcações' });
  }
});

// Obter uma marcação pelo ID (Read One)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM marcacoes WHERE id_marcacao = $1', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Marcação não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar marcação' });
  }
});

// Atualizar uma marcação (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_cliente, id_veiculo, data_marcacao, hora_marcacao, descricao, estado, stock_reservado, convertida_em_or, id_or_gerada, observacoes, criado_por } = req.body;
  try {
    const result = await pool.query(
      `UPDATE marcacoes SET id_cliente = $1, id_veiculo = $2, data_marcacao = $3, hora_marcacao = $4, descricao = $5, estado = $6, stock_reservado = $7, convertida_em_or = $8, id_or_gerada = $9, observacoes = $10, criado_por = $11
       WHERE id_marcacao = $12 RETURNING *`,
      [id_cliente, id_veiculo, data_marcacao, hora_marcacao, descricao, estado, stock_reservado, convertida_em_or, id_or_gerada, observacoes, criado_por, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Marcação não encontrada para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar marcação' });
  }
});

// Excluir uma marcação (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM marcacoes WHERE id_marcacao = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Marcação não encontrada para exclusão' });
    }
    res.json({ message: 'Marcação excluída com sucesso', marcacao: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir marcação' });
  }
});

module.exports = router;
