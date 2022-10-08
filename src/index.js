const express = require('express');
const bodyParser = require('body-parser');
const { 
  readTalkerData, createToken, validateEmail, validateDate, writeTalkerData, writeTalkerDataByList,
} = require('./fsUtils');

// iniciando

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const tokens = [];

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

app.post('/login', verifyEmail, verifyPassword, (req, res) => {
  const token = createToken();
  tokens.push(token);
  // console.log(`criei um token novo e a lista de tokens é ${tokens}`);
  res.status(200).json({ token });
});

// Aqui começa o Req 5

const verifyAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(`o token é ${authorization}`);
  if (!authorization) {
    // console.log('entrou no token não encontrado');
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (!tokens.some((tok) => tok === authorization)) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  // console.log('Não barrou a verificação de token');
  return next();
};

const verifyName = (req, res, next) => {
  const { name } = req.body;
  if (!name || name.length === 0) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  // console.log('nextei 2');
  return next();
};

const verifyAge = (req, res, next) => {
  const { age } = req.body;
  if (!age || String(age).length === 0) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  return next();
};

const verifyTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  if (!talk.watchedAt || talk.watchedAt.length === 0) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!validateDate(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  return next();
};

const verifyRate = (req, res, next) => {
  const { talk } = req.body;
  if (talk.rate === undefined || talk.rate.length === 0) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  return next();
};

app.post('/talker',
verifyAuthorization, verifyName, verifyAge, verifyTalk, verifyRate, async (req, res) => {
  const oldList = await readTalkerData();
  await writeTalkerData({ ...req.body, id: oldList.length + 1 });
  return res.status(201).json({ ...req.body, id: oldList.length + 1 });
});

  // Aqui começa o req 6
app.put('/talker/:id',
verifyAuthorization, verifyName, verifyAge, verifyTalk, verifyRate, async (req, res) => {
  const oldList = await readTalkerData();
  // console.log('old List', oldList);
  const newList = oldList.map((talker) => (
    talker.id === Number(req.params.id) ? { ...req.body, id: talker.id } : talker));
  // console.log('new List', newList);
  await writeTalkerDataByList(newList);
  return res.status(200).json({ ...req.body, id: Number(req.params.id) });
});

  // Aqui começa o req 7

app.delete('/talker/:id', verifyAuthorization, async (req, res) => {
  const oldList = await readTalkerData();
  console.log('lista velha', oldList);
  const newList = oldList.filter((talker) => (
    talker.id !== Number(req.params.id)
  ));
  console.log('id na requisição', req.params.id);
  console.log('nova lista', newList);
  await writeTalkerDataByList(newList);
  return res.status(204).end();
});

  // Aqui começa o req 8

app.listen(PORT, () => {
  console.log('Online');
});
