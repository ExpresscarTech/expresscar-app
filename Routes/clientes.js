// routes/clientes.js
//--------------------------------------------------
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

//--------------------------------------------------
// 1 ▸ CRIAR CLIENTE
//--------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      nif, nome_abreviado, nome, morada,
      codigo_postal, localidade, contactos,
      email, observacoes
    } = req.body;

    // garante JSONB ou null
    let contactosJson = null;
    if (contactos) {
      try   { contactosJson = typeof contactos === 'string' ? JSON.parse(contactos) : contactos; }
      catch { return res.status(400).json({ error: 'contactos deve ser JSON válido' }); }
    }

    const { rows } = await pool.query(
      `INSERT INTO clientes
         (nif, nome_abreviado, nome, morada, codigo_postal,
          localidade, contactos, email, observacoes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [nif, nome_abreviado, nome, morada,
       codigo_postal, localidade, contactosJson,
       email, observacoes]
    );
    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao inserir cliente' });
  }
});

//--------------------------------------------------
// 2 ▸ LISTAR TODOS
//--------------------------------------------------
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes ORDER BY id_cliente');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao buscar clientes' });
  }
});

//--------------------------------------------------
// 3 ▸ DETALHE
//--------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM clientes WHERE id_cliente = $1`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'cliente não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao buscar cliente' });
  }
});

//--------------------------------------------------
// 4 ▸ ATUALIZAR
//--------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const {
      nif, nome_abreviado, nome, morada,
      codigo_postal, localidade, contactos,
      email, observacoes
    } = req.body;

    let contactosJson = null;
    if (contactos) {
      try   { contactosJson = typeof contactos === 'string' ? JSON.parse(contactos) : contactos; }
      catch { return res.status(400).json({ error: 'contactos deve ser JSON válido' }); }
    }

    const { rows } = await pool.query(
      `UPDATE clientes SET
         nif=$1, nome_abreviado=$2, nome=$3, morada=$4,
         codigo_postal=$5, localidade=$6, contactos=$7,
         email=$8, observacoes=$9
       WHERE id_cliente=$10
       RETURNING *`,
      [ nif, nome_abreviado, nome, morada,
        codigo_postal, localidade, contactosJson,
        email, observacoes, req.params.id ]
    );
    if (!rows.length) return res.status(404).json({ error: 'cliente não encontrado' });
    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao atualizar cliente' });
  }
});

//--------------------------------------------------
// 5 ▸ EXCLUIR
//--------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM clientes WHERE id_cliente=$1 RETURNING *`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'cliente não encontrado' });
    res.json({ message: 'cliente excluído', cliente: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro ao excluir cliente' });
  }
});

module.exports = router;
