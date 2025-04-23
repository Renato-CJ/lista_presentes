import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Rota para salvar presente
app.post('/api/presentes', async (req, res) => {
  const { nome, presente } = req.body;
  try {
    await pool.query('INSERT INTO presentes (nome, presente) VALUES ($1, $2)', [nome, presente]);
    res.status(201).json({ message: 'Presente adicionado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar presente.' });
  }
});

// Rota para listar presentes
app.get('/api/presentes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM presentes');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar presentes.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
