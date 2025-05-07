// expresscar-app/Routes/artigos.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');  // usa pool central

// Listar todos os artigos
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id_artigo, referencia, descricao, marca, stock_atual, equivalencia
         FROM artigos
        ORDER BY referencia`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro em artigos GET /:', err.message);
    res.status(500).json({ error: 'Erro ao buscar artigos' });
  }
});

module.exports = router;
