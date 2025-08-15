const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Importa rotas
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/pontuacao');

app.use('/', authRoutes);
app.use('/', scoreRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
