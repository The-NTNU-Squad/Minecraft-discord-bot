const axios = require("axios");

const BASE = process.env.PAPER_API;

async function getPlayers() {
  const res = await axios.get(`${BASE}/players`);
  return res.data;
}

async function getPlayer(name) {
  const res = await axios.get(`${BASE}/player/${name}`);
  return res.data;
}

async function sendDiscordChat(user, message) {
  await axios.post(`${BASE}/discord-chat`, {
    user,
    message
  });
}

module.exports = {
  getPlayers,
  getPlayer,
  sendDiscordChat
};
