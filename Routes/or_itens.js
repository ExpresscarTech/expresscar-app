// routes/or_itens.js
//--------------------------------------------------
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

//--------------------------------------------------
// 1 ▸ ADICIONAR ITEM
//--------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      id_or, tipo_item, id_artigo, id_servico, descricao,
      marca, quantidade, preco_unitario, desconto,
      total_liquido, iva, total_com_iva, observacoes
    } = req.body;

    if (!['artigo', 'servico'].includes(tipo_item))
      return res.status(400).json({ error: 'tipo_item deve ser artigo ou servico' });

    const { rows } = await pool.query(
      `INSERT INTO or_itens
        (id_or, tipo_item, id_artigo, id_servico, descricao, marca,
         quantidade, preco_unitario, desconto, total_liquido,
         iva, total_com_iva, observacoes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [ id_or, tipo_item, id_artigo, id_servico, descricao, marca,
        quantidade, preco_unitario, desconto, total_liquido,
        iva, total_com_iva, observacoes ]
    );
    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao adicionar item' });
  }
});

//--------------------------------------------------
// 2 ▸ LISTAR ITENS DE UMA OR
//--------------------------------------------------
router.get('/ordem/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM or_itens WHERE id_or=$1 ORDER BY id_or_item`, [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao buscar itens' });
  }
});

//--------------------------------------------------
// 3 ▸ ATUALIZAR ITEM
//--------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const {
      id_or, tipo_item, id_artigo, id_servico, descricao,
      marca, quantidade, preco_unitario, desconto,
      total_liquido, iva, total_com_iva, observacoes
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE or_itens SET
         id_or=$1, tipo_item=$2, id_artigo=$3, id_servico=$4, descricao=$5,
         marca=$6, quantidade=$7, preco_unitario=$8, desconto=$9,
         total_liquido=$10, iva=$11, total_com_iva=$12, observacoes=$13
       WHERE id_or_item=$14
       RETURNING *`,
      [ id_or, tipo_item, id_artigo, id_servico, descricao, marca,
        quantidade, preco_unitario, desconto, total_liquido,
        iva, total_com_iva, observacoes, req.params.id ]
    );
    if (!rows.length) return res.status(404).json({ error: 'item não encontrado' });
    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao atualizar item' });
  }
});

//--------------------------------------------------
// 4 ▸ EXCLUIR ITEM
//--------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM or_itens WHERE id_or_item=$1 RETURNING *`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'item não encontrado' });
    res.json({ message: 'item excluído', item: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao excluir item' });
  }
});

module.exports = router;
