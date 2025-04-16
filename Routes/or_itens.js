// routes/or_itens.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Adicionar um item à ordem de reparação (Create)
router.post('/', async (req, res) => {
  const { id_or, tipo_item, id_artigo, id_servico, descricao, marca, quantidade, preco_unitario, desconto, total_liquido, iva, total_com_iva, observacoes } = req.body;
  try {
    const newItem = await pool.query(
      `INSERT INTO or_itens (id_or, tipo_item, id_artigo, id_servico, descricao, marca, quantidade, preco_unitario, desconto, total_liquido, iva, total_com_iva, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [id_or, tipo_item, id_artigo, id_servico, descricao, marca, quantidade, preco_unitario, desconto, total_liquido, iva, total_com_iva, observacoes]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao adicionar item à ordem' });
  }
});

// Listar itens de uma ordem (Read – filtrar por id_or)
router.get('/ordem/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM or_itens WHERE id_or = $1 ORDER BY id_or_item ASC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar itens da ordem' });
  }
});

// Atualizar um item da ordem (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_or, tipo_item, id_artigo, id_servico, descricao, marca, quantidade, preco_unitario, desconto, total_liquido, iva, total_com_iva, observacoes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE or_itens SET id_or = $1, tipo_item = $2, id_artigo = $3, id_servico = $4, descricao = $5, marca = $6, quantidade = $7, preco_unitario = $8, desconto = $9, total_liquido = $10, iva = $11, total_com_iva = $12, observacoes = $13
       WHERE id_or_item = $14 RETURNING *`,
      [id_or, tipo_item, id_artigo, id_servico, descricao, marca, quantidade, preco_unitario, desconto, total_liquido, iva, total_com_iva, observacoes, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Item não encontrado para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar item da ordem' });
  }
});

// Excluir um item da ordem (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM or_itens WHERE id_or_item = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Item não encontrado para exclusão' });
    }
    res.json({ message: 'Item excluído com sucesso', item: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir item da ordem' });
  }
});

module.exports = router;
