const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Força ser string
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.error("Erro detalhado:", err.message);
  } else {
    console.log("✅ Conectado ao Supabase com sucesso!");
  }
});

module.exports = pool;
