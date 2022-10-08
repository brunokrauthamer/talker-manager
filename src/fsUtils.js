const fs = require('fs').promises;
const path = require('path');

const TALKERS_DATA_PATH = './talker.json';

async function readTalkerData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, TALKERS_DATA_PATH));
    const talkers = await JSON.parse(data);
    // console.log(talkers);
    return talkers;
  } catch (error) {
    console.error(`Erro na leitura do arquivo Erro: ${error}`);
    return [];
  }
}

async function writeTalkerData(newTalker) {
  try {
    const oldTalkers = await readTalkerData();
    const allTalkers = JSON.stringify([...oldTalkers, newTalker]);
    await fs.writeFile(path.resolve(__dirname, TALKERS_DATA_PATH), allTalkers);
  } catch (error) {
    console.error(`Erro na escrita do arquivo ${error}`);
  }
}

// writeTalkerData({
//   name: 'Danielle Santos',
//   age: 56,
//   talk: {
//     watchedAt: '22/10/2019',
//     rate: 5,
//   },
// });

function createToken() {
  const charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 1; i <= 16; i += 1) {
    token += charList[Math.floor(Math.random() * 62)];
  }
  return token;
}

const validateEmail = (email) => {
  const re = (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
  return String(email)
    .toLowerCase()
    .match(re);
};

const validateDate = (date) => {
  const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
    if (date.match(reg)) {
      return true;
    }
    return false;
};

module.exports = {
  readTalkerData,
  writeTalkerData,
  createToken,
  validateEmail,
  validateDate,
};