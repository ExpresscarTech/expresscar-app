// routes/veiculos.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Endpoint para adicionar um novo veículo (Create)
router.post('/', async (req, res) => {
  const { id_cliente, matricula, marca, modelo, cc, kw, cv, combustivel, numero_motor, tecdoc, vin, data_primeira_matricula, rev_km, rev_dias } = req.body;
  
  try {
    const newVeiculo = await pool.query(
      `INSERT INTO veiculos (id_cliente, matricula, marca, modelo, cc, kw, cv, combustivel, numero_motor, tecdoc, vin, data_primeira_matricula, rev_km, rev_dias)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [id_cliente, matricula, marca, modelo, cc, kw, cv, combustivel, numero_motor, tecdoc, vin, data_primeira_matricula, rev_km, rev_dias]
    );
    res.status(201).json(newVeiculo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir veículo' });
  }
});

// Endpoint para listar todos os veículos (Read All)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM veiculos ORDER BY id_veiculo ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
});

// Endpoint para obter um veículo específico pelo ID (Read One)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM veiculos WHERE id_veiculo = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar veículo' });
  }
});

// Endpoint para atualizar um veículo existente (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_cliente, matricula, marca, modelo, cc, kw, cv, combustivel, numero_motor, tecdoc, vin, data_primeira_matricula, rev_km, rev_dias } = req.body;
  try {
    const result = await pool.query(
      `UPDATE veiculos
       SET id_cliente = $1,
           matricula = $2,
           marca = $3,
           modelo = $4,
           cc = $5,
           kw = $6,
           cv = $7,
           combustivel = $8,
           numero_motor = $9,
           tecdoc = $10,
           vin = $11,
           data_primeira_matricula = $12,
           rev_km = $13,
           rev_dias = $14
       WHERE id_veiculo = $15
       RETURNING *`,
      [id_cliente, matricula, marca, modelo, cc, kw, cv, combustivel, numero_motor, tecdoc, vin, data_primeira_matricula, rev_km, rev_dias, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado para atualizar' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
});

// Endpoint para excluir um veículo (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM veiculos WHERE id_veiculo = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Veículo não encontrado para exclusão' });
    }
    res.json({ message: 'Veículo excluído com sucesso', veiculo: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir veículo' });
  }
});

module.exports = router;
