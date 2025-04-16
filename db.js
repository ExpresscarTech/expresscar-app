// db.js

const { Pool } = require('pg');

const pool = new Pool({
  host: 'yamanote.proxy.rlwy.net',
  port: 51303,
  user: 'postgres',
  password: 'WxRYOyrVRuqhTDIZSrvwjbbjRmYnfnuc',
  database: 'railway'
});

// Testa a conexão (este código será executado quando db.js for importado)
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar no PostgreSQL:', err);
  } else {
    console.log('Conexão com PostgreSQL estabelecida com sucesso!');
    release();
  }
});

module.exports = pool;
