import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Para resolver __dirname no ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Criação da tabela, se não existir
await connection.execute(`
  CREATE TABLE IF NOT EXISTS presentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    desc TEXT,
    link TEXT,
    img TEXT,
    recebido BOOLEAN DEFAULT FALSE
  )
`);

// Rotas
app.get('/presentes', async (req, res) => {
  const [rows] = await connection.execute('SELECT * FROM presentes ORDER BY id DESC');
  res.json(rows);
});

app.post('/presentes', async (req, res) => {
  const { nome, desc, link, img } = req.body;
  await connection.execute('INSERT INTO presentes (nome, desc, link, img) VALUES (?, ?, ?, ?)', [
    nome, desc, link, img
  ]);
  res.sendStatus(201);
});

app.put('/presentes/:id', async (req, res) => {
  const { id } = req.params;
  const [row] = await connection.execute('SELECT recebido FROM presentes WHERE id = ?', [id]);
  if (!row.length) return res.sendStatus(404);
  const novoValor = !row[0].recebido;
  await connection.execute('UPDATE presentes SET recebido = ? WHERE id = ?', [novoValor, id]);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
