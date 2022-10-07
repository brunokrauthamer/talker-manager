const fs = require('fs').promises;
const path = require('path');

const TALKERS_DATA_PATH = './talker.json';

async function readTalkerData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, TALKERS_DATA_PATH));
    const talkers = await JSON.parse(data);
    console.log(talkers);
    return talkers;
  } catch (error) {
    console.error(`Erro na leitura do arquivo Erro: ${error}`);
    return [];
  }
}

async function writeTalkerData(newTaker) {
  try {
    const oldTalkers = await readTalkerData();
    const allTalkers = JSON.stringify([...oldTalkers, newTaker]);
    await fs.writeFile(TALKERS_DATA_PATH, allTalkers);
  } catch (error) {
    console.error(`Erro na escrita do arquivo ${error}`);
  }
}

readTalkerData();

module.exports = {
  readTalkerData,
  writeTalkerData,
};