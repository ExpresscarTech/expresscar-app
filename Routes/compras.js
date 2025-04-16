// routes/compras.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar uma nova compra (Create)
router.post('/', async (req, res) => {
  const { id_fornecedor, data_compra, documento, valor_total } = req.body;
  try {
    const newCompra = await pool.query(
      `INSERT INTO compras (id_fornecedor, data_compra, documento, valor_total)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_fornecedor, data_compra, documento, valor_total]
    );
    res.status(201).json(newCompra.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir compra' });
  }
});

// Listar todas as compras (Read All)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM compras ORDER BY id_compra ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar compras' });
  }
});

// Obter uma compra pelo ID (Read One)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM compras WHERE id_compra = $1', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar compra' });
  }
});

// Atualizar uma compra (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_fornecedor, data_compra, documento, valor_total } = req.body;
  try {
    const result = await pool.query(
      `UPDATE compras SET id_fornecedor = $1, data_compra = $2, documento = $3, valor_total = $4
       WHERE id_compra = $5 RETURNING *`,
      [id_fornecedor, data_compra, documento, valor_total, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Compra não encontrada para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar compra' });
  }
});

// Excluir uma compra (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM compras WHERE id_compra = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Compra não encontrada para exclusão' });
    }
    res.json({ message: 'Compra excluída com sucesso', compra: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir compra' });
  }
});

module.exports = router;
