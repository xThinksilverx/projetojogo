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
  console.log('Conectado ao MySQL (pontuacao)');
});

// Salvar pontuação
router.post('/score', (req, res) => {
  const { username, score } = req.body;
  if (!username || typeof score !== 'number') {
    return res.status(400).json({ error: 'Dados inválidos' });
  }
  // Busca o usuário pelo nome
  db.query('SELECT id FROM usuarios WHERE nome = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    const usuario_id = results[0].id;
    db.query('INSERT INTO pontuacoes (usuario_id, pontos) VALUES (?, ?)', [usuario_id, score], (err2) => {
      if (err2) return res.status(500).json({ error: 'Erro ao salvar pontuação' });
      res.json({ success: true });
    });
  });
});

// Listar ranking
router.get('/pontuacoes', (req, res) => {
  const sql = `
    SELECT u.nome, p.pontos, p.data_registro
    FROM pontuacoes p
    JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.pontos DESC, p.data_registro ASC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar pontuações' });
    res.json(results);
  });
});

module.exports = router;