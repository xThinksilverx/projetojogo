const express = require('express');
const router = express.Router();
const db = require('../db');

// Cadastro
router.post('/cadastrar', async (req, res) => {
  const { nome, telefone, email, senha } = req.body;
  if (!nome || !telefone || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  try {
    // Verifica se já existe usuário com o mesmo email
    const snapshot = await db.collection('usuarios').where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }
    await db.collection('usuarios').add({ nome, telefone, email, senha });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }
  try {
    const snapshot = await db.collection('usuarios')
      .where('email', '==', email)
      .where('senha', '==', senha)
      .get();
    if (!snapshot.empty) {
      const usuario = snapshot.docs[0].data();
      usuario.id = snapshot.docs[0].id;
      res.json({ usuario });
    } else {
      res.status(401).json({ error: 'Login inválido.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro no login.' });
  }
});

module.exports = router;