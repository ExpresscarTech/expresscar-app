// routes/log_acoes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar um novo log de ação (Create)
router.post('/', async (req, res) => {
  const { id_funcionario, acao, entidade_afetada } = req.body;
  try {
    const newLog = await pool.query(
      `INSERT INTO log_acoes (id_funcionario, acao, entidade_afetada)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_funcionario, acao, entidade_afetada]
    );
    res.status(201).json(newLog.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir log de ação' });
  }
});

// Listar todos os logs (Read All)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM log_acoes ORDER BY id_log ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

// Obter um log pelo ID (Read One)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM log_acoes WHERE id_log = $1', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Log não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar log' });
  }
});

// Atualizar um log de ação (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { id_funcionario, acao, entidade_afetada } = req.body;
  try {
    const result = await pool.query(
      `UPDATE log_acoes SET id_funcionario = $1, acao = $2, entidade_afetada = $3
       WHERE id_log = $4 RETURNING *`,
      [id_funcionario, acao, entidade_afetada, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Log não encontrado para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar log' });
  }
});

// Excluir um log de ação (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM log_acoes WHERE id_log = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Log não encontrado para exclusão' });
    }
    res.json({ message: 'Log excluído com sucesso', log: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir log' });
  }
});

module.exports = router;
