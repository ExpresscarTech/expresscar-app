// routes/anexos_or.js
//--------------------------------------------------
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

//--------------------------------------------------
// 1 ▸ Criar anexo
//--------------------------------------------------
router.post('/', async (req, res) => {
  const { id_or, caminho_arquivo, tipo_arquivo } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO anexos_or
         (id_or, caminho_arquivo, tipo_arquivo)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [id_or, caminho_arquivo, tipo_arquivo]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao inserir anexo' });
  }
});

//--------------------------------------------------
// 2 ▸ Listar anexos de uma OR
//--------------------------------------------------
router.get('/ordem/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM anexos_or
        WHERE id_or = $1
        ORDER BY id_anexo`, [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao buscar anexos' });
  }
});

//--------------------------------------------------
// 3 ▸ Atualizar anexo
//--------------------------------------------------
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_or, caminho_arquivo, tipo_arquivo } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE anexos_or
          SET id_or = $1,
              caminho_arquivo = $2,
              tipo_arquivo = $3
        WHERE id_anexo = $4
        RETURNING *`,
      [id_or, caminho_arquivo, tipo_arquivo, id]
    );
    if (!rows.length)
      return res.status(404).json({ error: 'anexo não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao atualizar anexo' });
  }
});

//--------------------------------------------------
// 4 ▸ Excluir anexo
//--------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM anexos_or
        WHERE id_anexo = $1
        RETURNING *`, [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ error: 'anexo não encontrado' });
    res.json({ message: 'anexo excluído', anexo: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao excluir anexo' });
  }
});

module.exports = router;
