// db.js
const { Pool } = require('pg');

// Só usar SSL em produção
const isProduction = process.env.NODE_ENV === 'production';

// Debug: mostrar a connection string
console.log('Connecting to', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

pool
  .connect()
  .then(() => console.log('Conexão com PostgreSQL estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar no PostgreSQL:', err));

module.exports = pool;