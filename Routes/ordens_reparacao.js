// routes/ordens_reparacao.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Criar uma nova ordem de reparação (Create)
router.post('/', async (req, res) => {
    const { id_veiculo, id_funcionario_criador, km_registado, descricao_intervencao, revisao, estado, data_fecho, observacoes, prioridade } = req.body;
    try {
        const newOr = await pool.query(
            `INSERT INTO ordens_reparacao (id_veiculo, id_funcionario_criador, km_registado, descricao_intervencao, revisao, estado, data_fecho, observacoes, prioridade)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [id_veiculo, id_funcionario_criador, km_registado, descricao_intervencao, revisao, estado, data_fecho, observacoes, prioridade]
        );
        res.status(201).json(newOr.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao criar ordem de reparação' });
    }
});

// Listar todas as ordens de reparação (Read All)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ordens_reparacao ORDER BY id_or ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ordens de reparação' });
    }
});

// Obter uma ordem de reparação pelo ID (Read One)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ordens_reparacao WHERE id_or = $1', [id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Ordem de reparação não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao buscar ordem de reparação' });
    }
});

// Atualizar uma ordem de reparação (Update)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_veiculo, id_funcionario_criador, km_registado, descricao_intervencao, revisao, estado, data_fecho, observacoes, prioridade } = req.body;
    try {
        const result = await pool.query(
            `UPDATE ordens_reparacao SET id_veiculo = $1, id_funcionario_criador = $2, km_registado = $3, descricao_intervencao = $4, revisao = $5, estado = $6, data_fecho = $7, observacoes = $8, prioridade = $9
             WHERE id_or = $10 RETURNING *`,
            [id_veiculo, id_funcionario_criador, km_registado, descricao_intervencao, revisao, estado, data_fecho, observacoes, prioridade, id]
        );
        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Ordem de reparação não encontrada para atualização' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao atualizar ordem de reparação' });
    }
});

// Excluir uma ordem de reparação (Delete)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM ordens_reparacao WHERE id_or = $1 RETURNING *', [id]);
        if(result.rows.length === 0) {
            return res.status(404).json({ error: 'Ordem de reparação não encontrada para exclusão' });
        }
        res.json({ message: 'Ordem de reparação excluída com sucesso', ordem: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro ao excluir ordem de reparação' });
    }
});

module.exports = router;
