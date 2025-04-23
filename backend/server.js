const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000; // ← Fallback para 3000 se PORT não estiver no .env

// Rota para obter todos os presentes
app.get('/presentes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM presentes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Rota para adicionar um presente
app.post('/presentes', async (req, res) => {
  try {
    const { nome, desc, link, img } = req.body;
    await db.query('INSERT INTO presentes (nome, desc, link, img) VALUES (?, ?, ?, ?)', [nome, desc, link, img]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Rota para alternar o status de recebido
app.put('/presentes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE presentes SET recebido = NOT recebido WHERE id = ?', [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
