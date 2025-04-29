// routes/veiculos.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');          // usa a mesma pool de conexão

// 1. LISTAR TODOS OS VEÍCULOS
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM veiculos ORDER BY id_veiculo');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
});

// 2. CRIAR NOVO VEÍCULO
router.post('/', async (req, res) => {
  try {
    const {
      id_cliente,
      matricula,
      marca,
      modelo,
      cc,
      kw,
      cv,
      combustivel,
      numero_motor,
      vin,
      rev_km,
      rev_dias
    } = req.body;

    const query = `
      INSERT INTO veiculos
        (id_cliente, matricula, marca, modelo, cc, kw, cv, combustivel,
         numero_motor, vin, rev_km, rev_dias)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`;
    const params = [
      id_cliente, matricula, marca, modelo, cc, kw, cv, combustivel,
      numero_motor, vin, rev_km, rev_dias
    ];

    const { rows } = await pool.query(query, params);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar veículo' });
  }
});

module.exports = router;
