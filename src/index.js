const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerData, createToken } = require('./fsUtils');

// iniciando

const app = express();
app.use(bodyParser.json());

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

app.post('/login', async (req, res) => res.status(200).json({ token: createToken() }));

app.listen(PORT, () => {
  console.log('Online');
});
