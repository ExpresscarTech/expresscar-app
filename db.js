const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false, // importante para funcionar no Render/Railway
  }
});

pool.connect()
  .then(() => console.log('Conexão com PostgreSQL estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar no PostgreSQL:', err));

module.exports = pool;
