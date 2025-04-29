// routes/fornecedores.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Endpoint para adicionar um novo fornecedor
router.post('/', async (req, res) => {
  const { nome, nif, morada, codigo_postal, localidade, telefone_comercial, email_comercial, telefone_contabilidade, email_contabilidade, contacto_responsavel, observacoes } = req.body;
  try {
    const newFornecedor = await pool.query(
      `INSERT INTO fornecedores (nome, nif, morada, codigo_postal, localidade, telefone_comercial, email_comercial, telefone_contabilidade, email_contabilidade, contacto_responsavel, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [nome, nif, morada, codigo_postal, localidade, telefone_comercial, email_comercial, telefone_contabilidade, email_contabilidade, contacto_responsavel, observacoes]
    );
    res.status(201).json(newFornecedor.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir fornecedor' });
  }
});

// Endpoint para listar todos os fornecedores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fornecedores ORDER BY id_fornecedor ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
});

// Endpoint para obter um fornecedor pelo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM fornecedores WHERE id_fornecedor = $1', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar fornecedor' });
  }
});

// Endpoint para atualizar um fornecedor
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, nif, morada, codigo_postal, localidade, telefone_comercial, email_comercial, telefone_contabilidade, email_contabilidade, contacto_responsavel, observacoes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE fornecedores SET nome = $1, nif = $2, morada = $3, codigo_postal = $4, localidade = $5, telefone_comercial = $6, email_comercial = $7, telefone_contabilidade = $8, email_contabilidade = $9, contacto_responsavel = $10, observacoes = $11
       WHERE id_fornecedor = $12 RETURNING *`,
      [nome, nif, morada, codigo_postal, localidade, telefone_comercial, email_comercial, telefone_contabilidade, email_contabilidade, contacto_responsavel, observacoes, id]
    );
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Fornecedor não encontrado para atualização' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
});

// Endpoint para excluir um fornecedor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM fornecedores WHERE id_fornecedor = $1 RETURNING *', [id]);
    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Fornecedor não encontrado para exclusão' });
    }
    res.json({ message: 'Fornecedor excluído com sucesso', fornecedor: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir fornecedor' });
  }
});

module.exports = router;
