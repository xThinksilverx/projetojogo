const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'senac_game'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL (auth)');
});

router.post('/cadastrar', (req, res) => {
  const { nome, telefone, email, senha } = req.body;
  if (!nome || !telefone || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  db.query(
    'INSERT INTO usuarios (nome, telefone, email, senha) VALUES (?, ?, ?, ?)',
    [nome, telefone, email, senha],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar.' });
      }
      res.json({ success: true });
    }
  );
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  db.query(
    'SELECT id, nome, email, telefone FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro no login.' });
      if (results.length > 0) {
        res.json({ usuario: results[0] });
      } else {
        res.status(401).json({ error: 'Login inválido.' });
      }
    }
  );
});

module.exports = router;