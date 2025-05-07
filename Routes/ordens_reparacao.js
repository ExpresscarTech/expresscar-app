// Routes/ordens_reparacao.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Criar nova ordem com lógica de upsert cliente/veículo
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Normalizar e extrair campos
    const matricula   = (req.body.matricula || '')
                          .replace(/[^A-Z0-9]/gi, '')
                          .toUpperCase();
    const km          = Number(req.body.km);
    const descricao   = (req.body.descricao || '').toUpperCase();
    const revisao     = Boolean(req.body.revisao);
    const nomeCliente = (req.body.nome_cliente || '').toUpperCase().trim();
    const contacto    = (req.body.contacto || '').toUpperCase().trim();
    const dataEntrega = req.body.data_entrega || null;

    // Upsert cliente (busca por contacto, depois por nome)
    let id_cliente = null;
    if (contacto || nomeCliente) {
      let found = [];
      if (contacto) {
        const resContact = await client.query(
          `SELECT id_cliente FROM clientes WHERE contactos->>'principal' = $1`,
          [contacto]
        );
        found = resContact.rows;
      }
      if (found.length === 0 && nomeCliente) {
        const resNome = await client.query(
          `SELECT id_cliente FROM clientes WHERE UPPER(nome) = $1`,
          [nomeCliente]
        );
        found = resNome.rows;
      }
      if (found.length) {
        id_cliente = found[0].id_cliente;
      } else {
        const { rows: [newCli] } = await client.query(
          `INSERT INTO clientes (nif, nome, contactos)
             VALUES ($1, $2, jsonb_build_object('principal', $3::text))
           RETURNING id_cliente`,
          ['', nomeCliente, contacto]
        );
        id_cliente = newCli.id_cliente;
      }
    }

    // Upsert veículo
    let id_veiculo;
    const { rows: vehRows } = await client.query(
      'SELECT id_veiculo, id_cliente FROM veiculos WHERE UPPER(matricula) = $1',
      [matricula]
    );
    if (vehRows.length) {
      id_veiculo = vehRows[0].id_veiculo;
      if (id_cliente && !vehRows[0].id_cliente) {
        await client.query(
          'UPDATE veiculos SET id_cliente = $1 WHERE id_veiculo = $2',
          [id_cliente, id_veiculo]
        );
      }
    } else {
      const { rows: [newVeh] } = await client.query(
        `INSERT INTO veiculos (matricula, id_cliente)
           VALUES ($1, $2)
         RETURNING id_veiculo`,
        [matricula, id_cliente]
      );
      id_veiculo = newVeh.id_veiculo;
    }

    // Criar a ordem com estado inicial CHEGADA
    const { rows: [newOr] } = await client.query(
      `INSERT INTO ordens_reparacao
         (id_veiculo, km_registado, descricao_intervencao, revisao, data_entrega, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id_veiculo, km, descricao, revisao, dataEntrega, 'CHEGADA']
    );

    await client.query('COMMIT');
    res.status(201).json(newOr);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro em POST /ordens:', err);
    res.status(500).json({ error: 'Erro ao criar ordem' });
  } finally {
    client.release();
  }
});

// Listar ordens existentes
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT orp.id_or, v.matricula, c.nome AS nome_cliente,
              orp.km_registado, orp.descricao_intervencao,
              orp.revisao, orp.data_entrada, orp.data_entrega, orp.estado
         FROM ordens_reparacao AS orp
    LEFT JOIN veiculos AS v ON v.id_veiculo = orp.id_veiculo
    LEFT JOIN clientes AS c ON c.id_cliente = v.id_cliente
    ORDER BY orp.id_or DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro em GET /ordens:', err);
    res.status(500).json({ error: 'Erro ao listar ordens' });
  }
});

module.exports = router;
