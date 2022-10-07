const fs = require('fs').promises;
// const path = require('path');

async function readTalkerData() {
  try {
    const data = await fs.readFile('./talker.json');
    const talkers = JSON.parse(data);
    return talkers;
  } catch (error) {
    console.error(`Erro na leitura do arquivo Erro: ${error}`);
  }
}

console.log(readTalkerData());

module.exports = {
  readTalkerData,
};