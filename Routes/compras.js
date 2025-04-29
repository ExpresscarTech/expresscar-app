// routes/compras.js
//--------------------------------------------------
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

//--------------------------------------------------
// 1 ▸ CRIAR COMPRA
//--------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { id_fornecedor, data_compra, documento, valor_total } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO compras
        (id_fornecedor, data_compra, documento, valor_total)
       VALUES ($1, $2::date, $3, $4)
       RETURNING *`,
      [id_fornecedor, data_compra, documento, valor_total]
    );
    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao inserir compra' });
  }
});

//--------------------------------------------------
// 2 ▸ LISTAR TODAS
//--------------------------------------------------
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM compras ORDER BY id_compra');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao buscar compras' });
  }
});

//--------------------------------------------------
// 3 ▸ DETALHE
//--------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM compras WHERE id_compra = $1`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'compra não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao buscar compra' });
  }
});

//--------------------------------------------------
// 4 ▸ ATUALIZAR
//--------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const { id_fornecedor, data_compra, documento, valor_total } = req.body;
    const { rows } = await pool.query(
      `UPDATE compras SET
         id_fornecedor=$1, data_compra=$2::date,
         documento=$3, valor_total=$4
       WHERE id_compra=$5
       RETURNING *`,
      [ id_fornecedor, data_compra, documento, valor_total, req.params.id ]
    );
    if (!rows.length) return res.status(404).json({ error: 'compra não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao atualizar compra' });
  }
});

//--------------------------------------------------
// 5 ▸ EXCLUIR
//--------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM compras WHERE id_compra=$1 RETURNING *`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'compra não encontrada' });
    res.json({ message: 'compra excluída', compra: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao excluir compra' });
  }
});

module.exports = router;
