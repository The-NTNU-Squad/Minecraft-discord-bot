const api = require("../services/paperApi");
module.exports = {
  name: "playerlist",
  async execute(message) {
    const data = await api.getPlayers();
    const players = data.players ? data.players.split(",").filter(p => p.length > 0) : [];
    if (!players.length) {
      return message.reply("目前沒有玩家在線");
    }
    message.reply(
      "目前在線玩家：\n" +
      players.map(p => `- ${p}`).join("\n")
    );
  }
};
