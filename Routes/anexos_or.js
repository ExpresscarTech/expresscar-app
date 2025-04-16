// routes/anexos_or.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar um novo anexo para uma OR (Create)
router.post('/', async (req, res) => {
  const { id_or, caminho_arquivo, tipo_arquivo } = req.body;
  try {
    const newAnexo = await pool.query(
      `INSERT INTO anexos_or (id_or, caminho_arquivo, tipo_arquivo)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_or, caminho_arquivo, tipo_arquivo]
    );
    res.status(201).json(newAnexo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir anexo' });
  }
});

// Listar todos os anexos para uma OR (Read)
router.get('/ordem/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM anexos_or WHERE id_or = $1 ORDER BY id_anexo ASC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar anexos' });
  }
});

// Atualizar um anexo (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_or, caminho_arquivo, tipo_arquivo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE anexos_or SET id_or = $1, caminho_arquivo = $2, tipo_arquivo = $3
       WHERE id_anexo = $4 RETURNING *`,
      [id_or, caminho_arquivo, tipo_arquivo, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Anexo não encontrado para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar anexo' });
  }
});

// Excluir um anexo (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM anexos_or WHERE id_anexo = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Anexo não encontrado para exclusão' });
    }
    res.json({ message: 'Anexo excluído com sucesso', anexo: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir anexo' });
  }
});

module.exports = router;
