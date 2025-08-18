const express = require('express');
const router = express.Router();
const db = require('../db');

// Salvar pontuação
router.post('/score', async (req, res) => {
  const { username, score } = req.body;
  if (!username || typeof score !== 'number') {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }
  try {
    await db.collection('pontuacoes').add({
      nome: username,
      pontos: score,
      data_registro: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar pontuação.' });
  }
});

// Buscar ranking
router.get('/pontuacoes', async (req, res) => {
  try {
    const snapshot = await db.collection('pontuacoes')
      .orderBy('pontos', 'desc')
      .limit(20)
      .get();
    const ranking = [];
    snapshot.forEach(doc => {
      ranking.push(doc.data());
    });
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar ranking.' });
  }
});

module.exports = router;