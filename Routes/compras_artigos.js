// routes/compras_artigos.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar um novo registro em compras_artigos (Create)
router.post('/', async (req, res) => {
  const { id_compra, id_artigo, quantidade, preco_unitario } = req.body;
  try {
    const newRegistro = await pool.query(
      `INSERT INTO compras_artigos (id_compra, id_artigo, quantidade, preco_unitario)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_compra, id_artigo, quantidade, preco_unitario]
    );
    res.status(201).json(newRegistro.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir registro em compras_artigos' });
  }
});

// Listar registros de uma compra (Read)
router.get('/compra/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM compras_artigos WHERE id_compra = $1 ORDER BY id_compra_artigo ASC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar registros da compra' });
  }
});

// Atualizar um registro em compras_artigos (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_compra, id_artigo, quantidade, preco_unitario } = req.body;
  try {
    const result = await pool.query(
      `UPDATE compras_artigos SET id_compra = $1, id_artigo = $2, quantidade = $3, preco_unitario = $4
       WHERE id_compra_artigo = $5 RETURNING *`,
      [id_compra, id_artigo, quantidade, preco_unitario, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Registro não encontrado para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar registro' });
  }
});

// Excluir um registro em compras_artigos (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM compras_artigos WHERE id_compra_artigo = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Registro não encontrado para exclusão' });
    }
    res.json({ message: 'Registro excluído com sucesso', registro: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir registro' });
  }
});

module.exports = router;
