const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('Conexão com PostgreSQL estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar no PostgreSQL:', err));

module.exports = pool;
