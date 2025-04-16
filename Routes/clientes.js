// routes/clientes.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criação de um novo cliente (Create)
router.post('/', async (req, res) => {
  const { nif, nome_abreviado, nome, morada, codigo_postal, localidade, contactos, email, observacoes } = req.body;
  
  try {
    const newCliente = await pool.query(
      `INSERT INTO clientes (nif, nome_abreviado, nome, morada, codigo_postal, localidade, contactos, email, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [nif, nome_abreviado, nome, morada, codigo_postal, localidade, contactos, email, observacoes]
    );
    
    res.status(201).json(newCliente.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao inserir cliente' });
  }
});

// Listar todos os clientes (Read All)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id_cliente ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Obter um cliente pelo ID (Read One)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id_cliente = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar o cliente' });
  }
});

// Atualizar um cliente (Update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nif, nome_abreviado, nome, morada, codigo_postal, localidade, contactos, email, observacoes } = req.body;

  // Tente converter o campo 'contactos' para JSON
  let contatosParsed;
  try {
    contatosParsed = JSON.parse(contactos);
  } catch (error) {
    // Se não for um JSON válido, retorne um erro
    return res.status(400).json({ error: 'Formato inválido para contatos. Deve ser um JSON válido.' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE clientes
       SET nif = $1, nome_abreviado = $2, nome = $3, morada = $4, codigo_postal = $5, localidade = $6, contactos = $7, email = $8, observacoes = $9
       WHERE id_cliente = $10
       RETURNING *`,
      [nif, nome_abreviado, nome, morada, codigo_postal, localidade, contatosParsed, email, observacoes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado para atualizar' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});


// Excluir um cliente (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM clientes WHERE id_cliente = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado para exclusão' });
    }
    res.json({ message: 'Cliente excluído com sucesso', cliente: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

module.exports = router;
