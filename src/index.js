const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerData, createToken, validateEmail } = require('./fsUtils');

// iniciando

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const talkers = await readTalkerData();

  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await readTalkerData();
  const talker = talkers.find((t) => t.id === Number(req.params.id));
  // console.log(talker);
  return talker ? res.status(200).json(talker) : res.status(404)
    .json({ message: 'Pessoa palestrante não encontrada' });
});

const verifyEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email || email.length === 0) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return next();
};

const verifyPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || password.length === 0) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  return next();
};

app.post('/login', verifyEmail, verifyPassword, (req, res) => (
  res.status(200).json({ token: createToken() })));

app.listen(PORT, () => {
  console.log('Online');
});
